import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRepo = query({
  args: { repoId: v.id("repositories") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo || repo.userId !== identity.subject) return [];

    return await ctx.db("reviews")
      .withIndex("by_repoId", (q: any) => q.eq("repoId", args.repoId))
      .order("desc")
      .take(50);
  },
});

export const get = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const review = await ctx.db("reviews").get(args.reviewId);
    if (!review) throw new Error("Review not found");

    const repo = await ctx.db("repositories").get(review.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    return review;
  },
});

export const getComments = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db("reviewComments")
      .withIndex("by_reviewId", (q: any) => q.eq("reviewId", args.reviewId))
      .collect();
  },
});

export const create = mutation({
  args: { repoId: v.id("repositories"), prNumber: v.number() },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    const reviewId = await ctx.db.insert("reviews", {
      repoId: args.repoId,
      prNumber: args.prNumber,
      prTitle: `PR #${args.prNumber}`,
      prAuthor: "unknown",
      prUrl: `https://github.com/${repo.fullName}/pull/${args.prNumber}`,
      status: "pending",
      modelUsed: "anthropic/claude-3-haiku",
      tokensUsed: 0,
      startedAt: Date.now(),
    });

    return reviewId;
  },
});

export const updateWithResults = mutation({
  args: {
    reviewId: v.id("reviews"),
    summary: v.string(),
    issues: v.array(v.object({
      type: v.string(),
      severity: v.string(),
      file: v.string(),
      line: v.optional(v.number()),
      message: v.string(),
      suggestedFix: v.optional(v.string()),
      confidence: v.number(),
    })),
    diffScore: v.number(),
    confidence: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.reviewId, {
      status: "completed",
      summary: args.summary,
      issues: args.issues,
      diffScore: args.diffScore,
      confidenceScore: args.confidence,
      completedAt: Date.now(),
    });

    for (const issue of args.issues) {
      await ctx.db.insert("reviewComments", {
        reviewId: args.reviewId,
        filePath: issue.file,
        lineNumber: issue.line,
        type: issue.type,
        content: issue.message,
        suggestedCode: issue.suggestedFix,
        confidence: issue.confidence,
        upvotes: 0,
        downvotes: 0,
        createdAt: Date.now(),
      });
    }
  },
});

export const addFeedback = mutation({
  args: {
    commentId: v.id("reviewComments"),
    feedback: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx: any, args: any) => {
    const comment = await ctx.db("reviewComments").get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    await ctx.db.patch(args.commentId, {
      upvotes: args.feedback === "up" ? comment.upvotes + 1 : comment.upvotes,
      downvotes: args.feedback === "down" ? comment.downvotes + 1 : comment.downvotes,
    });
  },
});
