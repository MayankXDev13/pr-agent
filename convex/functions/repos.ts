import { queryGeneric, mutationGeneric, actionGeneric } from "convex/server";
import { v } from "convex/values";
import { createGitHubClient, getUserRepositories, getPullRequests } from "../../src/lib/github";

export const listByUserId = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("repos")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getByFullName = queryGeneric({
  args: { fullName: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("repos")
      .withIndex("by_fullName", (q: any) => q.eq("fullName", args.fullName))
      .first();
  },
});

export const add = mutationGeneric({
  args: {
    userId: v.string(),
    accessToken: v.string(),
    owner: v.string(),
    name: v.string(),
    fullName: v.string(),
    defaultBranch: v.string(),
    language: v.optional(v.string()),
    private: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("repos")
      .withIndex("by_fullName", (q: any) => q.eq("fullName", args.fullName))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("repos", {
      userId: args.userId,
      owner: args.owner,
      name: args.name,
      fullName: args.fullName,
      webhookInstalled: false,
      defaultBranch: args.defaultBranch,
      language: args.language,
      private: args.private,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutationGeneric({
  args: { id: v.id("repos") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

export const syncFromGitHub = actionGeneric({
  args: { userId: v.string(), accessToken: v.string() },
  handler: async (ctx: any, args: any) => {
    try {
      const octokit = createGitHubClient(args.accessToken);
      const githubRepos = await getUserRepositories(octokit);

      for (const repo of githubRepos) {
        await ctx.runMutation(async (m: any) => {
          return await m("repos").insert({
            userId: args.userId,
            owner: repo.owner,
            name: repo.name,
            fullName: repo.fullName,
            webhookInstalled: false,
            defaultBranch: repo.defaultBranch,
            language: repo.language,
            private: repo.private,
            createdAt: Date.now(),
          });
        });
      }

      return { success: true, count: githubRepos.length };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const listPRsForRepo = queryGeneric({
  args: { repoId: v.id("repos") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("pullRequests")
      .withIndex("by_repoId", (q: any) => q.eq("repoId", args.repoId))
      .collect();
  },
});

export const getPRByNumber = queryGeneric({
  args: {
    owner: v.string(),
    repo: v.string(),
    prNumber: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const repo = await ctx.db
      .query("repos")
      .withIndex("by_fullName", (q: any) => q.eq("fullName", `${args.owner}/${args.repo}`))
      .first();

    if (!repo) return null;

    return await ctx.db
      .query("pullRequests")
      .withIndex("by_prNumber", (q: any) =>
        q.eq("repoId", repo._id).eq("prNumber", args.prNumber)
      )
      .first();
  },
});

export const getRepoByName = queryGeneric({
  args: { owner: v.string(), repo: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("repos")
      .withIndex("by_fullName", (q: any) => q.eq("fullName", `${args.owner}/${args.repo}`))
      .first();
  },
});

export const syncPRs = actionGeneric({
  args: {
    repoId: v.id("repos"),
    accessToken: v.string(),
    owner: v.string(),
    name: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    try {
      const octokit = createGitHubClient(args.accessToken);
      const prs = await getPullRequests(octokit, args.owner, args.name, "open");

      for (const pr of prs) {
        const existing = await ctx.runQuery(async (q: any) => {
          return await q("pullRequests")
            .withIndex("by_prNumber", (r: any) =>
              r.eq("repoId", args.repoId).eq("prNumber", pr.number)
            )
            .first();
        });

        if (!existing) {
          await ctx.runMutation(async (m: any) => {
            return await m("pullRequests").insert({
              repoId: args.repoId,
              prNumber: pr.number,
              title: pr.title,
              state: pr.state,
              author: pr.author,
              baseBranch: pr.baseBranch,
              headBranch: pr.headBranch,
              additions: pr.additions,
              deletions: pr.deletions,
              changedFiles: pr.changedFiles,
              lastReviewedAt: undefined,
              createdAt: pr.createdAt,
            });
          });
        }
      }

      return { success: true, count: prs.length };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
