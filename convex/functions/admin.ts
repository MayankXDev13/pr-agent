import { queryGeneric, mutationGeneric, actionGeneric } from "convex/server";
import { v } from "convex/values";

export const getByUserId = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("admin_users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .first();
  },
});

export const create = mutationGeneric({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
    createdAt: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("admin_users", args);
  },
});

export const seedAdminUser = actionGeneric({
  handler: async (ctx: any) => {
    const adminGithubUsername = process.env.INITIAL_ADMIN_GITHUB_USERNAME;

    if (!adminGithubUsername) {
      console.log("No INITIAL_ADMIN_GITHUB_USERNAME set, skipping admin seed");
      return { success: false, message: "No admin username configured" };
    }

    try {
      const existingAdmin = await ctx.db
        .query("admin_users")
        .withIndex("by_userId", (q: any) => q.eq("userId", adminGithubUsername))
        .first();

      if (existingAdmin) {
        console.log(`Admin ${adminGithubUsername} already exists`);
        return { success: true, message: "Admin already exists" };
      }

      await ctx.db.insert("admin_users", {
        userId: adminGithubUsername,
        role: "super_admin",
        createdAt: Date.now(),
      });

      console.log(`Created admin user: ${adminGithubUsername}`);
      return {
        success: true,
        message: `Admin created: ${adminGithubUsername}`,
      };
    } catch (error) {
      console.error("Failed to seed admin user:", error);
      return {
        success: false,
        message: `Failed to create admin: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
