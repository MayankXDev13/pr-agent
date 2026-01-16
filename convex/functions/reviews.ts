import { queryGeneric, mutationGeneric, actionGeneric } from "convex/server";
import { v } from "convex/values";
import { generateReview } from "../../src/lib/ai";
import { createGitHubClient, getPullRequestFiles } from "../../src/lib/github";

export const getByPrId = queryGeneric({
  args: { prId: v.id("pullRequests") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_prId", (q: any) => q.eq("prId", args.prId))
      .collect();
  },
});

export const getByRepoAndPr = queryGeneric({
  args: {
    owner: v.string(),
    repo: v.string(),
    prNumber: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const repo = await ctx.runQuery(async (q: any) => {
      return await q("repos")
        .withIndex("by_fullName", (r: any) =>
          r.eq("fullName", `${args.owner}/${args.repo}`)
        )
        .first();
    });

    if (!repo) return [];

    const pr = await ctx.runQuery(async (q: any) => {
      return await q("pullRequests")
        .withIndex("by_prNumber", (p: any) =>
          p.eq("repoId", repo._id).eq("prNumber", args.prNumber)
        )
        .first();
    });

    if (!pr) return [];

    return await ctx.db
      .query("reviews")
      .withIndex("by_prId", (q: any) => q.eq("prId", pr._id))
      .collect();
  },
});

export const triggerReview = actionGeneric({
  args: {
    repoId: v.id("repos"),
    prId: v.id("pullRequests"),
    accessToken: v.string(),
    owner: v.string(),
    repo: v.string(),
    prNumber: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    try {
      const octokit = createGitHubClient(args.accessToken);

      const prData = await ctx.runQuery(async (q: any) => {
        return await q("pullRequests")
          .withIndex("by_prNumber", (p: any) =>
            p.eq("repoId", args.repoId).eq("prNumber", args.prNumber)
          )
          .first();
      });

      if (!prData) {
        return { success: false, error: "PR not found" };
      }

      const files = await getPullRequestFiles(octokit, args.owner, args.repo, args.prNumber);

      const reviewInput = {
        title: prData.title,
        description: "",
        author: prData.author,
        baseBranch: prData.baseBranch,
        headBranch: prData.headBranch,
        files: files.map((f) => ({
          filename: f.filename,
          patch: f.patch,
          additions: f.additions,
          deletions: f.deletions,
        })),
      };

      const result = await generateReview(reviewInput);

      if (!result.success) {
        return result;
      }

      const reviewId = await ctx.runMutation(async (m: any) => {
        return await m("reviews").insert({
          prId: args.prId,
          modelUsed: result.modelUsed!,
          summary: result.summary!,
          findings: result.findings!,
          reviewTimeMs: result.reviewTimeMs!,
          createdAt: Date.now(),
        });
      });

      await ctx.runMutation(async (m: any) => {
        return await m("pullRequests").update(args.prId, {
          lastReviewedAt: Date.now(),
        });
      });

      return {
        success: true,
        reviewId,
        summary: result.summary,
        findingsCount: result.findings?.length || 0,
        reviewTimeMs: result.reviewTimeMs,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Review failed",
      };
    }
  },
});

export const getLatestReviews = queryGeneric({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const reviews = await ctx.db.query("reviews").collect();
    return reviews
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .slice(0, args.limit || 10);
  },
});
