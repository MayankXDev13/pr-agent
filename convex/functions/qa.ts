import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const listSessions = query({
  args: { repoId: v.id("repositories") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo || repo.userId !== identity.subject) return [];

    return await ctx.db("qaSessions")
      .withIndex("by_repoId", (q: any) => q.eq("repoId", args.repoId))
      .order("desc")
      .take(50);
  },
});

export const getSession = query({
  args: { sessionId: v.id("qaSessions") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const session = await ctx.db("qaSessions").get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const repo = await ctx.db("repositories").get(session.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    return session;
  },
});

export const createSession = mutation({
  args: { repoId: v.id("repositories"), question: v.string() },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const repo = await ctx.db("repositories").get(args.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    const sessionId = await ctx.db.insert("qaSessions", {
      repoId: args.repoId,
      question: args.question,
      answer: null,
      status: "pending",
      modelUsed: "anthropic/claude-3-haiku",
      tokensUsed: 0,
      startedAt: Date.now(),
    });

    return sessionId;
  },
});

export const updateWithAnswer = mutation({
  args: {
    sessionId: v.id("qaSessions"),
    answer: v.string(),
    sources: v.array(v.object({
      file: v.string(),
      line: v.number(),
      content: v.string(),
    })),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      answer: args.answer,
      sources: args.sources,
      completedAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id("qaSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const session = await ctx.db("qaSessions").get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const repo = await ctx.db("repositories").get(session.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.insert("qaMessages", {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { sessionId: v.id("qaSessions") },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const session = await ctx.db("qaSessions").get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const repo = await ctx.db("repositories").get(session.repoId);
    if (!repo || repo.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    return await ctx.db("qaMessages")
      .withIndex("by_sessionId", (q: any) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});
