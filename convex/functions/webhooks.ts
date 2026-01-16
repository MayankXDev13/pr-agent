"use node";

import { actionGeneric } from "convex/server";
import { v } from "convex/values";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    return true;
  }

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
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

        if (action === "opened" || action === "synchronize") {
          const repo = await ctx.runQuery(async (q: any) => {
            return await q("repos")
              .withIndex("by_fullName", (r: any) =>
                r.eq("fullName", repository.full_name)
              )
              .first();
          });

          if (repo) {
            await ctx.runMutation(async (m: any) => {
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
                lastReviewedAt: undefined,
                createdAt: new Date(pull_request.created_at).getTime(),
              });
            });

            console.log(`PR #${pull_request.number} ${action} in ${repository.full_name}`);
          }
        }

        return {
          success: true,
          event: args.event,
          action,
          prNumber: pull_request.number,
          repo: repository.full_name,
        };
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
