import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db("users").get(args.userId);
    if (!user) return null;

    return {
      plan: user.plan,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      subscriptionStatus: user.subscriptionStatus,
    };
  },
});

export const updateUserPlan = mutation({
  args: {
    userId: v.string(),
    plan: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.userId, {
      plan: args.plan,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus,
      updatedAt: Date.now(),
    });
  },
});

export const getUsageStats = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db("users").get(args.userId);
    if (!user) return null;

    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = user.usage || {
      reviewsThisMonth: 0,
      indexingsThisMonth: 0,
      lastResetAt: now,
    };

    if (usage.lastResetAt < monthStart.getTime()) {
      return {
        reviewsThisMonth: 0,
        indexingsThisMonth: 0,
        reviewsLimit: user.plan === "free" ? 100 : user.plan === "pro" ? 1000 : Infinity,
        indexingsLimit: user.plan === "free" ? 20 : user.plan === "pro" ? 100 : Infinity,
      };
    }

    const limits = {
      free: { reviews: 100, indexings: 20 },
      pro: { reviews: 1000, indexings: 100 },
      enterprise: { reviews: Infinity, indexings: Infinity },
    };

    const plan = user.plan as keyof typeof limits || "free";

    return {
      reviewsThisMonth: usage.reviewsThisMonth,
      indexingsThisMonth: usage.indexingsThisMonth,
      reviewsLimit: limits[plan].reviews,
      indexingsLimit: limits[plan].indexings,
    };
  },
});

export const incrementUsage = mutation({
  args: { userId: v.string(), type: v.union(v.literal("review"), v.literal("indexing")) },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db("users").get(args.userId);
    if (!user) return;

    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = user.usage || {
      reviewsThisMonth: 0,
      indexingsThisMonth: 0,
      lastResetAt: now,
    };

    if (usage.lastResetAt < monthStart.getTime()) {
      usage.reviewsThisMonth = 0;
      usage.indexingsThisMonth = 0;
      usage.lastResetAt = now;
    }

    if (args.type === "review") {
      usage.reviewsThisMonth += 1;
    } else {
      usage.indexingsThisMonth += 1;
    }

    await ctx.db.patch(args.userId, { usage });
  },
});

export const canCreateReview = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db("users").get(args.userId);
    if (!user) return { allowed: false, reason: "User not found" };

    if (user.plan === "enterprise") {
      return { allowed: true };
    }

    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = user.usage || {
      reviewsThisMonth: 0,
      indexingsThisMonth: 0,
      lastResetAt: now,
    };

    if (usage.lastResetAt < monthStart.getTime()) {
      return { allowed: true };
    }

    const limit = user.plan === "pro" ? 1000 : 100;

    if (usage.reviewsThisMonth >= limit) {
      return { allowed: false, reason: "Monthly review limit reached" };
    }

    return { allowed: true };
  },
});

export const canCreateIndexing = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db("users").get(args.userId);
    if (!user) return { allowed: false, reason: "User not found" };

    if (user.plan === "enterprise") {
      return { allowed: true };
    }

    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = user.usage || {
      reviewsThisMonth: 0,
      indexingsThisMonth: 0,
      lastResetAt: now,
    };

    if (usage.lastResetAt < monthStart.getTime()) {
      return { allowed: true };
    }

    const limit = user.plan === "pro" ? 100 : 20;

    if (usage.indexingsThisMonth >= limit) {
      return { allowed: false, reason: "Monthly indexing limit reached" };
    }

    return { allowed: true };
  },
});
