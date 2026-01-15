import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const listPatterns = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      return [];
    }

    return await ctx.db("learnedPatterns")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createPattern = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    trigger: v.string(),
    rule: v.string(),
    examples: v.array(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error("Not authorized");
    }

    const patternId = await ctx.db.insert("learnedPatterns", {
      userId: args.userId,
      type: args.type,
      trigger: args.trigger,
      rule: args.rule,
      examples: args.examples,
      positiveFeedback: 0,
      negativeFeedback: 0,
      usageCount: 0,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return patternId;
  },
});

export const applyPatterns = action({
  handler: async (_ctx: any, args: any) => {
    return [];
  },
});

export const updateFeedback = mutation({
  args: {
    patternId: v.id("learnedPatterns"),
    feedback: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx: any, args: any) => {
    const pattern = await ctx.db("learnedPatterns").get(args.patternId);
    if (!pattern) throw new Error("Pattern not found");

    await ctx.db.patch(args.patternId, {
      positiveFeedback: args.feedback === "up" ? pattern.positiveFeedback + 1 : pattern.positiveFeedback,
      negativeFeedback: args.feedback === "down" ? pattern.negativeFeedback + 1 : pattern.negativeFeedback,
      updatedAt: Date.now(),
    });
  },
});

export const deletePattern = mutation({
  args: { patternId: v.id("learnedPatterns") },
  handler: async (ctx: any, args: any) => {
    const pattern = await ctx.db("learnedPatterns").get(args.patternId);
    if (!pattern) throw new Error("Pattern not found");

    await ctx.db.patch(args.patternId, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

export const getPatternsForReview = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) return [];

    return await ctx.db("learnedPatterns")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
  },
});

export const incrementUsage = mutation({
  args: { patternId: v.id("learnedPatterns") },
  handler: async (ctx: any, args: any) => {
    const pattern = await ctx.db("learnedPatterns").get(args.patternId);
    if (!pattern) return;

    await ctx.db.patch(args.patternId, {
      usageCount: pattern.usageCount + 1,
    });
  },
});
