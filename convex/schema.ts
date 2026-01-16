import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    githubAccessToken: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  repos: defineTable({
    userId: v.string(),
    owner: v.string(),
    name: v.string(),
    fullName: v.string(),
    webhookInstalled: v.boolean(),
    webhookId: v.optional(v.number()),
    defaultBranch: v.string(),
    language: v.optional(v.string()),
    private: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_fullName", ["fullName"]),

  pullRequests: defineTable({
    repoId: v.id("repos"),
    prNumber: v.number(),
    title: v.string(),
    state: v.string(),
    author: v.string(),
    baseBranch: v.string(),
    headBranch: v.string(),
    additions: v.number(),
    deletions: v.number(),
    changedFiles: v.number(),
    lastReviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_repoId", ["repoId"])
    .index("by_prNumber", ["repoId", "prNumber"]),

  reviews: defineTable({
    prId: v.id("pullRequests"),
    repoId: v.id("repos"),
    score: v.number(),
    securityScore: v.number(),
    bugScore: v.number(),
    styleScore: v.number(),
    summary: v.string(),
    findings: v.array(v.object({
      type: v.union(v.literal("security"), v.literal("bug"), v.literal("style"), v.literal("breaking")),
      file: v.string(),
      line: v.optional(v.number()),
      severity: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
      message: v.string(),
      suggestion: v.string(),
      codeSnippet: v.optional(v.string()),
    })),
    commentsPosted: v.number(),
    modelUsed: v.string(),
    reviewTimeMs: v.number(),
    createdAt: v.number(),
  }).index("by_repoId", ["repoId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_score", ["repoId", "score"]),

  admin_users: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  audit_logs: defineTable({
    action: v.string(),
    userId: v.optional(v.string()),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_action", ["action"]),
});
