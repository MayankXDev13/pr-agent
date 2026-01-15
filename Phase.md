# PR Agent Implementation Plan

A Greptile-like AI-powered PR review agent with codebase context awareness, built with Next.js, Convex, and Vercel AI SDK.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER FACING (Next.js)                              │
│                                                                              │
│   Public Pages:                      Dashboard:                             │
│   ├── Landing page                   ├── Repositories                       │
│   ├── Pricing page                   ├── Reviews (with diff scores 1-5)     │
│   ├── Sign in                        ├── Q&A                                │
│   └── Admin panel (admin only)       └── Settings                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Next.js API + Convex)                       │
│                                                                              │
│   Auth: NextAuth.js (GitHub OAuth)                                          │
│   API: REST endpoints for frontend                                          │
│   Webhooks: GitHub App for PR events                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONVEX BACKEND                                       │
│                                                                              │
│   Database: PostgreSQL (Convex managed)                                     │
│                                                                              │
│   Functions:                                                                 │
│   ├── auth.ts         - User management, Stripe sync                        │
│   ├── repos.ts        - Repo CRUD, webhook setup                            │
│   ├── index.ts        - Codebase indexing                                   │
│   ├── review.ts       - PR review with diff score (1-5)                     │
│   ├── embeddings.ts   - Vector search                                       │
│   ├── patterns.ts     - Pattern learning from feedback                      │
│   ├── ask.ts          - Q&A feature                                         │
│   ├── webhooks.ts     - GitHub App webhook processing                       │
│   ├── usage.ts        - Free/Pro tier limits                                │
│   ├── payments.ts     - Stripe integration                                  │
│   └── admin.ts        - Admin panel functions                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                        │                        │
                    ▼                        ▼                        ▼
         ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
         │    GitHub API    │     │   OpenRouter     │     │    Nomic API     │
         │                  │     │   (Vercel AI     │     │   (Embeddings)   │
         │  OAuth + PRs +   │     │    SDK Core)     │     │                  │
         │  Webhooks        │     │                  │     │                  │
         └──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Bun | 1.x |
| Framework | Next.js | 14.x (App Router) |
| Language | TypeScript | 5.x |
| Database | Convex | 1.x |
| Auth | NextAuth.js | 4.x |
| LLM SDK | Vercel AI SDK | 3.x |
| LLM Provider | OpenRouter | API |
| Embeddings | Nomic Embed Code | v1 |
| Payments | Stripe | - |
| Styling | Tailwind CSS | 3.x |
| Deployment | Vercel | Hobby tier |

## Pricing Model

### Free Tier (Hobby)
| Resource | Limit |
|----------|-------|
| Repositories | 5 |
| PR Reviews/month | 100 |
| Codebase indexings | 20 |
| Pattern storage | 50 |
| Models | Free only |

### Pro Tier ($9/month)
| Resource | Limit |
|----------|-------|
| Repositories | 50 |
| PR Reviews/month | 1000 |
| Codebase indexings | 100 |
| Pattern storage | 500 |
| Models | All (including GPT-4, Claude 3 Opus) |
| Priority support | Yes |

### Enterprise Tier ($49/month)
| Resource | Limit |
|----------|-------|
| Repositories | Unlimited |
| PR Reviews/month | Unlimited |
| Models | All + custom models |
| Dedicated support | Yes |
| Custom rules | Unlimited |

## Diff Score System (1-5)

| Score | Meaning | Action |
|-------|---------|--------|
| 5 | Excellent | Approve |
| 4 | Good with minor suggestions | Approve with comments |
| 3 | Needs some improvements | Request changes |
| 2 | Significant issues | Request changes |
| 1 | Critical issues | Block |

### Score Calculation
```
diffScore = weighted_average(
  bug_severity * 0.25,
  security_severity * 0.30,
  performance_score * 0.15,
  style_score * 0.10,
  breaking_change_score * 0.20
)
```

---

## Phases

### Phase 1: Project Foundation (Setup & Auth)
**Duration:** ~2 hours

**Goal:** Set up project with GitHub authentication

**Files to create:**
```
pr-agent/
├── package.json          # Dependencies
├── .env.example          # Environment template
├── bunfig.toml           # Bun config
│
├── src/
│   ├── lib/
│   │   └── auth.ts       # NextAuth + GitHub OAuth
│   │
│   └── app/
│       ├── api/auth/[...nextauth]/route.ts  # Auth handler
│       └── (auth)/signin/page.tsx           # Login page
│
└── convex/
    ├── schema.ts         # Users table only
    └── functions/auth.ts # User management
```

**Deliverable:** Working login with GitHub OAuth

---

### Phase 2: Repository Management
**Duration:** ~2 hours

**Goal:** Connect repositories with webhooks

**Files to create:**
```
src/app/(dashboard)/repos/page.tsx                  # Repo list
src/app/(dashboard)/repos/[owner]/[repo]/page.tsx  # Repo detail
src/components/repos/RepoCard.tsx
src/components/repos/AddRepoModal.tsx
│
convex/functions/repos.ts  # Add/remove/list repos
convex/schema.ts           # Add repositories table
```

**GitHub OAuth Scopes:**
```
repo, read:user, read:org, admin:repo_hook
```

**Deliverable:** User can add/remove GitHub repos

---

### Phase 3: Code Indexing
**Duration:** ~3 hours

**Goal:** Index codebase for context-aware reviews

**Files to create:**
```
src/lib/embeddings.ts     # Nomic API integration
│
convex/functions/index.ts # Indexing pipeline
convex/functions/embeddings.ts  # Vector search
convex/schema.ts          # Add codeChunks table
```

**Supported Languages:**
```
TypeScript, JavaScript, Python, Go, Rust, Java, C++, C#, PHP, Ruby, Swift, Kotlin, Scala, Vue, Svelte
```

**Chunking Strategy:**
- Max 80 lines per chunk
- Preserve function/class boundaries
- Extract imports/exports
- Track line numbers

**Deliverable:** Codebase indexed, searchable

---

### Phase 4: PR Review with Diff Score
**Duration:** ~4 hours

**Goal:** Review PRs and post comments with 1-5 score

**Files to create:**
```
src/lib/llm.ts            # Vercel AI SDK + OpenRouter
src/lib/prompts.ts        # Review prompts
│
convex/functions/review.ts # Review pipeline + diff score
convex/schema.ts          # Add reviews, comments tables
│
src/app/(dashboard)/reviews/page.tsx
src/app/(dashboard)/reviews/[id]/page.tsx
src/components/reviews/ReviewCard.tsx
src/components/reviews/DiffScoreBadge.tsx
```

**Review Categories:**
```
1. Bugs & edge cases (HIGH priority)
2. Security issues (CRITICAL)
3. Performance problems
4. Architecture violations
5. Style & consistency
6. Breaking changes
```

**Deliverable:** PR reviews with diff score (1-5)

---

### Phase 5: Q&A Feature
**Duration:** ~2 hours

**Goal:** Chat about codebase

**Files to create:**
```
convex/functions/ask.ts   # Q&A pipeline
│
src/app/(dashboard)/ask/page.tsx
src/components/ask/ChatWindow.tsx
```

**Deliverable:** Ask questions about code

---

### Phase 6: Pattern Learning
**Duration:** ~2 hours

**Goal:** Learn from user feedback

**Files to create:**
```
convex/functions/patterns.ts  # Pattern learning
convex/schema.ts              # Add learnedPatterns table
│
src/components/reviews/FeedbackButtons.tsx
```

**Learning Process:**
```
1. User downvotes a comment → Creates pattern
2. Pattern stored in learnedPatterns table
3. Applied to future reviews
4. Feedback loop improves accuracy
```

**Deliverable:** System learns from upvotes/downvotes

---

### Phase 7: Stripe Payments
**Duration:** ~4 hours

**Goal:** Free/Pro tier with billing

**Files to create:**
```
src/lib/stripe.ts        # Stripe integration
│
convex/functions/payments.ts  # Subscription management
convex/functions/usage.ts     # Limit enforcement
convex/schema.ts              # Add plan, stripe fields
│
src/app/(public)/pricing/page.tsx
src/app/(dashboard)/settings/billing/page.tsx
src/components/billing/PricingCard.tsx
```

**Stripe Webhook Events:**
```
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

**Deliverable:** Subscription billing

---

### Phase 8: Admin Panel
**Duration:** ~3 hours

**Goal:** User/repo management for admins

**Files to create:**
```
src/app/(dashboard)/admin/page.tsx
src/app/(dashboard)/admin/users/page.tsx
src/app/(dashboard)/admin/repos/page.tsx
src/app/(dashboard)/admin/analytics/page.tsx
│
convex/functions/admin.ts  # Admin functions
```

**Admin Features:**
```
- View all users
- Manage subscriptions
- View all repositories
- Usage analytics
- System health
```

**Deliverable:** Admin dashboard

---

## Complete Project Structure

```
pr-agent/
├── .env.example                     # Environment variables
├── bunfig.toml                      # Bun configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── .eslintrc.json                   # ESLint configuration
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts     # NextAuth handler
│   │   │   │
│   │   │   ├── webhooks/
│   │   │   │   └── github/
│   │   │   │       └── route.ts     # GitHub App webhook
│   │   │   │
│   │   │   └── stripe/
│   │   │       ├── webhook/
│   │   │       │   └── route.ts     # Stripe webhooks
│   │   │       └── checkout/
│   │   │           └── route.ts     # Checkout session
│   │   │
│   │   ├── (auth)/
│   │   │   └── signin/
│   │   │       └── page.tsx         # Sign in page
│   │   │
│   │   ├── (public)/
│   │   │   └── pricing/
│   │   │       └── page.tsx         # Pricing page
│   │   │
│   │   └── (dashboard)/
│   │       ├── layout.tsx           # Dashboard layout
│   │       ├── page.tsx             # Main dashboard
│   │       │
│   │       ├── repos/
│   │       │   ├── page.tsx         # Repository list
│   │       │   └── [owner]/
│   │       │       └── [repo]/
│   │       │           ├── page.tsx           # Repo detail
│   │       │           └── page.tsx
│   │       │
│   │       ├── reviews/
│   │       │   ├── page.tsx         # Review history
│   │       │   └── [id]/
│   │       │       └── page.tsx     # Review detail with diff score
│   │       │
│   │       ├── ask/
│   │       │   └── page.tsx         # Q&A interface
│   │       │
│   │       ├── settings/
│   │       │   ├── page.tsx         # User settings
│   │       │   └── billing/
│   │       │       └── page.tsx     # Billing management
│   │       │
│   │       └── admin/               # Admin panel (admin only)
│   │           ├── page.tsx         # Dashboard overview
│   │           ├── users/
│   │           │   ├── page.tsx     # User management
│   │           │   └── [id]/
│   │           │       └── page.tsx # User detail
│   │           ├── repos/
│   │           │   ├── page.tsx     # All repos
│   │           │   └── [id]/
│   │           │       └── page.tsx # Repo detail
│   │           └── analytics/
│   │               └── page.tsx     # Usage analytics
│   │
│   ├── components/
│   │   ├── ui/                      # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── repos/                   # Repo components
│   │   │   ├── RepoCard.tsx
│   │   │   ├── RepoList.tsx
│   │   │   ├── AddRepoModal.tsx
│   │   │   ├── RepoSettings.tsx
│   │   │   └── IndexingStatus.tsx
│   │   │
│   │   ├── reviews/                 # Review components
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── DiffScoreBadge.tsx   # Score 1-5 display
│   │   │   ├── IssueList.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   └── FeedbackButtons.tsx
│   │   │
│   │   ├── ask/                     # Q&A components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── QuestionInput.tsx
│   │   │   └── AnswerDisplay.tsx
│   │   │
│   │   ├── billing/                 # Billing components
│   │   │   ├── PricingCard.tsx
│   │   │   ├── PricingTable.tsx
│   │   │   └── SubscriptionStatus.tsx
│   │   │
│   │   ├── admin/                   # Admin components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── RepoTable.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   │
│   │   └── feedback/                # Feedback components
│   │       └── FeedbackButtons.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts                  # NextAuth config
│   │   ├── github.ts                # GitHub API helpers
│   │   ├── llm.ts                   # Vercel AI SDK + OpenRouter
│   │   ├── embeddings.ts            # Nomic API
│   │   ├── prompts.ts               # Prompt templates
│   │   ├── stripe.ts                # Stripe integration
│   │   ├── admin.ts                 # Admin helpers
│   │   ├── utils.ts                 # Utility functions
│   │   └── constants.ts             # Constants
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRepos.ts
│   │   ├── useReviews.ts
│   │   ├── useConversation.ts
│   │   └── useSubscription.ts       # Stripe subscription
│   │
│   └── types/
│       └── index.ts                 # TypeScript types
│
└── convex/
    ├── schema.ts                    # Database schema
    ├── config.ts                    # Convex config
    │
    └── functions/
        ├── auth.ts                  # User & subscription
        ├── repos.ts                 # Repository CRUD
        ├── index.ts                 # Code indexing
        ├── review.ts                # PR review + diff score
        ├── embeddings.ts            # Vector search
        ├── patterns.ts              # Pattern learning
        ├── ask.ts                   # Q&A
        ├── webhooks.ts              # GitHub App
        ├── usage.ts                 # Limits enforcement
        ├── payments.ts              # Stripe webhooks
        └── admin.ts                 # Admin panel functions
```

---

## Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT_URL=https://your-deployment.convex.cloud
CONVEX_SECRET_KEY=your-convex-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# GitHub OAuth App (for user login)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# GitHub App (for webhooks)
GITHUB_APP_ID=your-github-app-id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# OpenRouter (LLM)
OPENROUTER_API_KEY=your-openrouter-api-key

# Nomic (Embeddings)
NOMIC_API_KEY=your-nomic-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_FREE=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

---

## GitHub App Setup

### 1. Create GitHub OAuth App
- Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
- Homepage URL: `https://your-domain.com`
- Callback URL: `https://your-domain.com/api/auth/callback/github`
- Scopes: `repo, read:user, read:org, admin:repo_hook`

### 2. Create GitHub App (for webhooks)
- Go to GitHub Settings → Developer settings → GitHub Apps → New GitHub App
- Homepage URL: `https://your-domain.com`
- Webhook URL: `https://your-domain.com/api/webhooks/github`
- Permissions:
  - Pull requests: Read
  - Issues: Read
  - Contents: Read
  - Metadata: Read
  - Webhooks: Read & Write

---

## Setup Commands

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash

# 2. Create Next.js app
bun create next-app@latest pr-agent \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir

cd pr-agent

# 3. Install dependencies
bun add next-auth @octokit openapi-types ai uuid convex zod
bun add -D @types/uuid

# 4. Initialize Convex
bunx convex dev

# 5. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# 6. Run development server
bun run dev
```

---

## Implementation Timeline

| Phase | Duration | Goal |
|-------|----------|------|
| Phase 1 | 2 hours | Auth & login |
| Phase 2 | 2 hours | Repo management |
| Phase 3 | 3 hours | Code indexing |
| Phase 4 | 4 hours | PR reviews + score |
| Phase 5 | 2 hours | Q&A feature |
| Phase 6 | 2 hours | Pattern learning |
| Phase 7 | 4 hours | Stripe payments |
| Phase 8 | 3 hours | Admin panel |
| **Total** | **~22 hours** | Complete app |

---

## LLM Models

### Free Models (via OpenRouter)
| Model | Provider | Quality | Speed |
|-------|----------|---------|-------|
| anthropic/claude-3-haiku | Anthropic | ⭐⭐⭐⭐ | Fast |
| google/gemini-pro | Google | ⭐⭐⭐⭐ | Fast |
| mistral/mistral-large | Mistral | ⭐⭐⭐⭐ | Medium |

### Paid Models (Pro/Enterprise)
| Model | Quality | Use Case |
|-------|---------|----------|
| anthropic/claude-3-sonnet | ⭐⭐⭐⭐⭐ | Complex codebases |
| anthropic/claude-3-opus | ⭐⭐⭐⭐⭐ | Deep analysis |
| openai/gpt-4o | ⭐⭐⭐⭐⭐ | Fast, smart |

---

## Free Tier Limits

| Resource | Limit | Enforcement |
|----------|-------|-------------|
| Repositories | 5 | `repos.add()` |
| PR Reviews/month | 100 | `review.create()` |
| Indexings/month | 20 | `index.start()` |
| Repository size | 1000 files | `repos.add()` |
| Custom patterns | 50 | `patterns.createCustom()` |

---

## To Start Implementation

1. Read this Phase.md file
2. Choose which phase to implement first
3. Follow the file structure for that phase
4. Create files in order

Start with **Phase 1** for foundation (recommended), or jump to any phase as needed.
