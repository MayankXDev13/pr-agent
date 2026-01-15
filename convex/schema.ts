import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    githubUsername: v.optional(v.string()),
    githubAccessToken: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    plan: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    settings: v.optional(v.object({
      defaultModel: v.string(),
      autoReview: v.boolean(),
      reviewCategories: v.array(v.string()),
    })),
    usage: v.optional(v.object({
      reviewsThisMonth: v.number(),
      indexingsThisMonth: v.number(),
      lastResetAt: v.number(),
    })),
    isAdmin: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_stripe", ["stripeCustomerId"]),

  repositories: defineTable({
    userId: v.string(),
    githubRepoId: v.number(),
    owner: v.string(),
    name: v.string(),
    fullName: v.string(),
    description: v.optional(v.string()),
    defaultBranch: v.string(),
    isActive: v.boolean(),
    webhookId: v.optional(v.number()),
    settings: v.optional(v.object({
      autoIndex: v.boolean(),
      autoReview: v.boolean(),
      reviewCategories: v.array(v.string()),
    })),
    indexingStatus: v.optional(v.object({
      state: v.string(),
      progress: v.number(),
      lastIndexedAt: v.optional(v.number()),
      filesCount: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_fullName", ["fullName"])
    .index("by_githubRepoId", ["githubRepoId"]),

  codeChunks: defineTable({
    repoId: v.id("repositories"),
    filePath: v.string(),
    chunkIndex: v.number(),
    content: v.string(),
    language: v.string(),
    startLine: v.number(),
    endLine: v.number(),
    embedding: v.optional(v.array(v.number())),
    metadata: v.optional(v.object({
      functionName: v.optional(v.string()),
      className: v.optional(v.string()),
      imports: v.array(v.string()),
    })),
    createdAt: v.number(),
  })
    .index("by_repoId", ["repoId"])
    .index("by_path", ["repoId", "filePath"]),

  reviews: defineTable({
    repoId: v.id("repositories"),
    prNumber: v.number(),
    prTitle: v.string(),
    prAuthor: v.string(),
    prUrl: v.string(),
    status: v.string(),
    diffScore: v.optional(v.number()),
    summary: v.optional(v.string()),
    issues: v.optional(v.array(v.object({
      type: v.string(),
      severity: v.string(),
      file: v.string(),
      line: v.optional(v.number()),
      message: v.string(),
      suggestedFix: v.optional(v.string()),
      confidence: v.number(),
    }))),
    modelUsed: v.string(),
    tokensUsed: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_repoId", ["repoId"])
    .index("by_repoPr", ["repoId", "prNumber"])
    .index("by_diffScore", ["diffScore"]),

  reviewComments: defineTable({
    reviewId: v.id("reviews"),
    githubCommentId: v.optional(v.number()),
    filePath: v.string(),
    lineNumber: v.optional(v.number()),
    type: v.string(),
    content: v.string(),
    suggestedCode: v.optional(v.string()),
    confidence: v.number(),
    upvotes: v.number(),
    downvotes: v.number(),
    createdAt: v.number(),
  })
    .index("by_reviewId", ["reviewId"]),

  learnedPatterns: defineTable({
    userId: v.string(),
    type: v.string(),
    trigger: v.string(),
    rule: v.string(),
    examples: v.array(v.string()),
    positiveFeedback: v.number(),
    negativeFeedback: v.number(),
    usageCount: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["userId", "type"]),

  usageLogs: defineTable({
    userId: v.string(),
    repoId: v.optional(v.id("repositories")),
    action: v.string(),
    cost: v.number(),
    model: v.string(),
    metadata: v.optional(v.object({
      prNumber: v.optional(v.number()),
    })),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_month", ["userId", "createdAt"]),

  qaSessions: defineTable({
    repoId: v.id("repositories"),
    question: v.string(),
    answer: v.optional(v.string()),
    status: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_repoId", ["repoId"]),

  qaMessages: defineTable({
    sessionId: v.id("qaSessions"),
    role: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"]),

  qaSources: defineTable({
    sessionId: v.id("qaSessions"),
    file: v.string(),
    line: v.number(),
    content: v.string(),
    relevanceScore: v.number(),
  })
    .index("by_sessionId", ["sessionId"]),

  stripeEvents: defineTable({
    eventId: v.string(),
    eventType: v.string(),
    customerId: v.string(),
    data: v.string(),
    processed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_eventId", ["eventId"])
    .index("by_customer", ["customerId"]),
});
