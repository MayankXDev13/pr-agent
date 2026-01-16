import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByFullName = query({
  args: { fullName: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db("repositories")
      .withIndex("by_fullName", (q: any) => q.eq("fullName", args.fullName))
      .collect();
  },
});

export const reindexOnPush = mutation({
  args: { repoId: v.id("repositories"), commitSha: v.string() },
  handler: async (ctx: any, args: any) => {
    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo) throw new Error("Repository not found");

    await ctx.db.patch(args.repoId, {
      lastIndexedAt: Date.now(),
      lastCommitSha: args.commitSha,
      indexingStatus: "pending",
    });

    return { success: true, repoId: args.repoId };
  },
});

export const updateWebhookStatus = mutation({
  args: {
    repoId: v.id("repositories"),
    webhookInstalled: v.boolean(),
    webhookId: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.repoId, {
      webhookInstalled: args.webhookInstalled,
      webhookId: args.webhookId,
      updatedAt: Date.now(),
    });
  },
});

export const getByInstallationId = query({
  args: { installationId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db("repositories")
      .withIndex("by_installationId", (q: any) => q.eq("githubInstallationId", args.installationId))
      .collect();
  },
});

export const handleGitHubAppInstallation = mutation({
  args: {
    action: v.string(),
    installationId: v.string(),
    accountLogin: v.string(),
    accountType: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    if (args.action === "created") {
      console.log(`GitHub App installed by ${args.accountLogin} (${args.accountType})`);
      return { success: true, action: "logged" };
    }
    
    if (args.action === "deleted") {
      console.log(`GitHub App uninstalled by ${args.accountLogin}`);
      return { success: true, action: "uninstall_logged" };
    }

    return { success: true, action: "ignored" };
  },
});
