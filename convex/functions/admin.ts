import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllUsers = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    return await ctx.db("users").collect();
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    const user = await ctx.db("users").get(args.userId);
    if (!user) throw new Error("User not found");

    return user;
  },
});

export const updateUserByAdmin = mutation({
  args: {
    userId: v.string(),
    plan: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, {
      plan: args.plan,
      isAdmin: args.isAdmin,
      updatedAt: Date.now(),
    });
  },
});

export const getAllRepos = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    return await ctx.db("repositories").collect();
  },
});

export const getRepoById = query({
  args: { repoId: v.id("repositories") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo) throw new Error("Repository not found");

    return repo;
  },
});

export const deleteRepoByAdmin = mutation({
  args: { repoId: v.id("repositories") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    await ctx.db.delete(args.repoId);
  },
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    const users = await ctx.db("users").collect();
    const repos = await ctx.db("repositories").collect();
    const reviews = await ctx.db("reviews").collect();
    const usageLogs = await ctx.db("usageLogs").collect();

    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthLogs = usageLogs.filter((log: any) => log.createdAt >= monthStart.getTime());

    const planCounts = {
      free: users.filter((u: any) => u.plan === "free").length,
      pro: users.filter((u: any) => u.plan === "pro").length,
      enterprise: users.filter((u: any) => u.plan === "enterprise").length,
    };

    return {
      totalUsers: users.length,
      totalRepos: repos.length,
      totalReviews: reviews.length,
      thisMonthReviews: thisMonthLogs.filter((l: any) => l.action === "review").length,
      planCounts,
    };
  },
});

export const getAllReviews = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    return await ctx.db("reviews")
      .order("desc")
      .take(100);
  },
});

export const getSystemHealth = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.tokenSets?.isAdmin) {
      throw new Error("Admin access required");
    }

    const users = await ctx.db("users").collect();
    const repos = await ctx.db("repositories").collect();
    const reviews = await ctx.db("reviews").collect();

    return {
      totalUsers: users.length,
      totalRepos: repos.length,
      totalReviews: reviews.length,
      activeRepos: repos.filter((r: any) => r.isActive).length,
      completedReviews: reviews.filter((r: any) => r.status === "completed").length,
    };
  },
});
