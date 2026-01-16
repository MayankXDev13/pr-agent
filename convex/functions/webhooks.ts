"use node";

import { actionGeneric, queryGeneric, mutationGeneric } from "convex/server";
import { v } from "convex/values";
import crypto from "crypto";
import { createGitHubClient, getPullRequest, getPullRequestFiles, postComment, getRelatedCode, postInlineComments } from "../../src/lib/github";
import { analyzePR } from "../../src/lib/review-llm";
import { calculatePRScore } from "../../src/lib/pr-scorer";
import { generateSummaryComment, generateInlineComments } from "../../src/lib/comment-formatter";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    return true;
  }

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

async function getUserToken(ctx: any, userId: string): Promise<string> {
  const user = await ctx.runQuery(async (q: any) => {
    return await q("users")
      .withIndex("by_userId", (u: any) => u.eq("userId", userId))
      .first();
  });
  
  if (!user || !user.githubAccessToken) {
    throw new Error("GitHub access token not found");
  }
  
  return user.githubAccessToken;
}

export const handleWebhook = actionGeneric({
  args: {
    payload: v.string(),
    signature: v.optional(v.string()),
    event: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    if (args.signature && !verifySignature(args.payload, args.signature)) {
      return { success: false, error: "Invalid webhook signature" };
    }

    try {
      const payload = JSON.parse(args.payload);

      if (args.event === "pull_request") {
        const { action, pull_request, repository } = payload;

        if (!["opened", "synchronize"].includes(action)) {
          return { success: true, message: "Ignoring non-relevant action", event: args.event, action };
        }

        const repo = await ctx.runQuery(async (q: any) => {
          return await q("repos")
            .withIndex("by_fullName", (r: any) =>
              r.eq("fullName", repository.full_name)
            )
            .first();
        });

        if (!repo) {
          return { success: true, message: "Repo not configured", event: args.event };
        }

        const startTime = Date.now();

        try {
          const accessToken = await getUserToken(ctx, repo.userId);
          const octokit = createGitHubClient(accessToken);

          const prData = await getPullRequest(
            octokit,
            repository.owner.login,
            repository.name,
            pull_request.number
          );

          const diffs = await getPullRequestFiles(
            octokit,
            repository.owner.login,
            repository.name,
            pull_request.number
          );

          const relatedCode = await getRelatedCode(
            octokit,
            repository.owner.login,
            repository.name,
            diffs.map((d) => d.filename),
            pull_request.base.ref
          );

          const reviewContext = {
            prTitle: pull_request.title,
            prDescription: pull_request.body || "",
            author: pull_request.user?.login || "unknown",
            baseBranch: pull_request.base.ref,
            headBranch: pull_request.head.ref,
            diffs: diffs.map((d) => ({
              filename: d.filename,
              patch: d.patch || "",
              additions: d.additions,
              deletions: d.deletions,
            })),
            relatedCode,
          };

          const findings = await analyzePR(reviewContext);
          const score = calculatePRScore(findings);
          const inlineComments = generateInlineComments(findings);

          if (inlineComments.length > 0) {
            await postInlineComments(
              octokit,
              repository.owner.login,
              repository.name,
              pull_request.number,
              pull_request.head.sha,
              inlineComments
            );
          }

          const summaryComment = generateSummaryComment(score, findings, pull_request.title);
          await postComment(
            octokit,
            repository.owner.login,
            repository.name,
            pull_request.number,
            summaryComment
          );

          let pr = await ctx.runQuery(async (q: any) => {
            return await q("pullRequests")
              .withIndex("by_prNumber", (p: any) =>
                p.eq("repoId", repo._id).eq("prNumber", pull_request.number)
              )
              .first();
          });

          if (!pr) {
            const prId = await ctx.runMutation(async (m: any) => {
              return await m("pullRequests").insert({
                repoId: repo._id,
                prNumber: pull_request.number,
                title: pull_request.title,
                state: pull_request.state,
                author: pull_request.user?.login || "unknown",
                baseBranch: pull_request.base.ref,
                headBranch: pull_request.head.ref,
                additions: 0,
                deletions: 0,
                changedFiles: 0,
                lastReviewedAt: Date.now(),
                createdAt: new Date(pull_request.created_at).getTime(),
              });
            });
            
            pr = { _id: prId };
          }

          const allFindings = [
            ...findings.security.map((f) => ({ ...f, type: "security" as const })),
            ...findings.bugs.map((f) => ({ ...f, type: "bug" as const })),
            ...findings.style.map((f) => ({ ...f, type: "style" as const })),
            ...findings.breaking.map((f) => ({ ...f, type: "breaking" as const })),
          ];

          await ctx.runMutation(async (m: any) => {
            await m("reviews").insert({
              prId: pr._id,
              repoId: repo._id,
              score: score.overall,
              securityScore: score.security,
              bugScore: score.bugs,
              styleScore: score.style,
              summary: summaryComment,
              findings: allFindings,
              commentsPosted: inlineComments.length,
              modelUsed: "meta-llama/llama-3.2-3b-instruct",
              reviewTimeMs: Date.now() - startTime,
              createdAt: Date.now(),
            });
          });

          await ctx.runMutation(async (m: any) => {
            await m("pullRequests").update(pr._id, {
              lastReviewedAt: Date.now(),
            });
          });

          return {
            success: true,
            event: args.event,
            action,
            prNumber: pull_request.number,
            repo: repository.full_name,
            score: score.overall,
            findingsCount: allFindings.length,
            commentsPosted: inlineComments.length,
          };
        } catch (error) {
          console.error("Review failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Review failed",
            event: args.event,
          };
        }
      }

      return { success: true, event: args.event, message: "Event received" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to parse webhook payload",
      };
    }
  },
});