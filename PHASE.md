# PR Agent Implementation Plan

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 15 + TypeScript + Bun |
| Backend | Convex (Database + Serverless Functions) |
| Auth | Better Auth + GitHub OAuth + Convex Adapter |
| AI | Vercel AI SDK + OpenRouter + Llama 3.3 70B |
| UI | Shadcn/UI + Lucide React + Strict B&W Theme |
| Git | GitHub API + Webhooks |
| Deployment | Docker |

---

## PHASE 1: Project Setup ✅ COMPLETE

### Summary
Initialize Next.js 15 project with Bun, configure TypeScript, TailwindCSS, shadcn/ui with Strict B&W theme, and Tremor charts.

### Key Tasks
1. ✅ Create Next.js 15 app using Bun
2. ✅ Configure TypeScript compiler options
3. ✅ Set up TailwindCSS with shadcn/ui
4. ✅ Configure Strict B&W theme (monochrome colors only)
5. ✅ Install and configure Tremor charts
6. ✅ Set up Convex project
7. ✅ Create project folder structure
8. ✅ Configure environment variables (.env.local)
9. ✅ Set up path aliases (@/*)

### Deliverables
- ✅ Working Next.js 15 project structure
- ✅ Configured TailwindCSS + Shadcn/ui
- ✅ Convex backend connected
- ✅ Environment configuration complete

---

## PHASE 2: Database Schema ✅ COMPLETE

### Summary
Design and implement Convex database schema for users, sessions, repositories, pull requests, reviews, admin users, and audit logs.

### Key Tables
1. **users** - User profiles with GitHub data
2. **sessions** - Better Auth session data (via authTables)
3. **repos** - User's connected repositories
4. **pullRequests** - PR metadata and state
5. **reviews** - AI review results with findings
6. **admin_users** - Admin access control
7. **audit_logs** - Critical admin actions

### Key Tasks
1. ✅ Define users table schema (userId, email, name, avatarUrl, githubAccessToken, createdAt)
2. ✅ Define sessions table schema for Better Auth (via authTables)
3. ✅ Define repos table schema (userId, owner, name, fullName, webhookInstalled, defaultBranch, language, createdAt)
4. ✅ Define pullRequests table schema (repoId, prNumber, title, state, author, baseBranch, headBranch, additions, deletions, changedFiles, lastReviewedAt, createdAt)
5. ✅ Define reviews table schema (prId, modelUsed, summary, findings array, reviewTimeMs, createdAt)
6. ✅ Define admin_users table schema (userId, role, createdAt)
7. ✅ Define audit_logs table schema (action, userId, details, ipAddress, timestamp)
8. ✅ Create indexes for efficient queries (by userId, by fullName, by repoId, by prId)
9. ✅ Write schema validation rules

### Deliverables
- ✅ Complete Convex schema file (convex/schema.ts)
- ✅ All required tables with indexes
- ✅ Schema validation in place
- ✅ Better Auth integration (convex/auth.ts)

---

## PHASE 3: Authentication ✅ COMPLETE

### Summary
Implement GitHub OAuth authentication using Better Auth with Convex adapter. Set up admin seed script for initial admin account.

### Key Tasks
1. ✅ Install Better Auth and dependencies
2. ✅ Configure Convex adapter for Better Auth
3. ✅ Set up GitHub OAuth provider with client ID and secret
4. ✅ Create Better Auth client instance for frontend
5. ✅ Implement OAuth callback handler
6. ✅ Create login page with GitHub sign-in button
7. ✅ Set up session management and persistence
8. ✅ Create admin seed script that:
   - Runs on first application startup
   - Reads INITIAL_ADMIN_GITHUB_USERNAME from environment
   - Fetches user's GitHub profile to get userId
   - Inserts record into admin_users table
   - Logs admin creation
9. ✅ Implement route protection middleware
10. ✅ Create admin role verification function

### Deliverables
- ✅ Working GitHub OAuth login
- ✅ User session management
- ✅ Admin seed script functional
- ✅ Protected routes configured

---

## PHASE 4: GitHub Integration ✅ COMPLETE

### Summary
Build GitHub API integration for repository management, PR fetching, webhook handling, and automatic review triggering.

### Key Tasks
1. ✅ Create GitHub API client using Octokit
2. ✅ Implement repository add functionality:
   - Fetch user's repositories from GitHub API
   - Filter to show only user's own repos
   - Store repo connection in database
   - Set up webhook for connected repo
3. ✅ Implement repository removal functionality
4. ✅ Implement PR fetching:
   - Fetch PR list for connected repos
   - Fetch PR files and diffs
   - Parse changed files and line changes
5. ✅ Set up webhook endpoint for GitHub events:
   - Handle pull_request opened event
   - Handle pull_request synchronize event
   - Implement hybrid triggering (auto + manual)
6. ✅ Implement webhook authentication (secret verification)
7. ✅ Implement GitHub comment posting:
   - Post bot comment with review summary
   - Create PR review with inline suggestions
8. ✅ Handle webhook retry and error cases

### Deliverables
- ✅ GitHub API client functional (src/lib/github.ts)
- ✅ Repository add/remove working (convex/functions/repos.ts)
- ✅ PR fetching and diff parsing
- ✅ Webhook endpoint operational (src/app/api/webhooks/github/route.ts)
- ✅ GitHub comments posting working (convex/functions/reviews.ts)

---

## PHASE 5: AI Review Engine 🚧 IN PROGRESS

### Summary
Implement AI-powered PR review using Vercel AI SDK with OpenRouter provider. Real-time streaming to UI with structured output parsing.

### Key Tasks
1. Set up Vercel AI SDK with OpenRouter provider
2. Configure Llama 3.3 70B model via OpenRouter
3. Create review prompt templates:
   - Summary template (high-level PR overview)
   - Bug detection template (potential bugs/issues)
   - Security template (vulnerabilities)
   - Style template (code style violations)
   - Suggestion template (improvement recommendations)
4. Design structured output schema for findings:
   - Finding type (bug/security/style/suggestion/info)
   - File path
   - Line number
   - Message
   - Severity level (low/medium/high/critical)
5. Implement single combined review prompt
6. Set up streaming response handling
7. Implement real-time streaming UI updates
8. Store complete review in database
9. Implement notification system:
   - Dashboard notification
   - GitHub comment posting
   - Email notification (via API)
   - Webhook notification (Slack/Discord)
10. No rate limits (unlimited reviews per user)

### Deliverables
- AI review engine working
- Structured output parsing functional
- Real-time streaming to UI
- All notification channels working

---

## PHASE 4: GitHub Integration

### Summary
Build GitHub API integration for repository management, PR fetching, webhook handling, and automatic review triggering.

### Key Tasks
1. Create GitHub API client using Octokit
2. Implement repository add functionality:
   - Fetch user's repositories from GitHub API
   - Filter to show only user's own repos
   - Store repo connection in database
   - Set up webhook for connected repo
3. Implement repository removal functionality
4. Implement PR fetching:
   - Fetch PR list for connected repos
   - Fetch PR files and diffs
   - Parse changed files and line changes
5. Set up webhook endpoint for GitHub events:
   - Handle pull_request opened event
   - Handle pull_request synchronize event
   - Implement hybrid triggering (auto + manual)
6. Implement webhook authentication (secret verification)
7. Implement GitHub comment posting:
   - Post bot comment with review summary
   - Create PR review with inline suggestions
8. Handle webhook retry and error cases

### Deliverables
- GitHub API client functional
- Repository add/remove working
- PR fetching and diff parsing
- Webhook endpoint operational
- GitHub comments posting working

---

## PHASE 5: AI Review Engine

### Summary
Implement AI-powered PR review using Vercel AI SDK with OpenRouter provider. Real-time streaming to UI with structured output parsing.

### Key Tasks
1. Install Vercel AI SDK and OpenRouter provider
2. Configure OpenRouter client with API key
3. Set up Llama 3.3 70B model configuration
4. Create review prompt templates:
   - Summary template (high-level PR overview)
   - Bug detection template (potential bugs/issues)
   - Security template (vulnerabilities)
   - Style template (code style violations)
   - Suggestion template (improvement recommendations)
5. Design structured output schema for findings:
   - Finding type (bug/security/style/suggestion/info)
   - File path
   - Line number
   - Message
   - Severity level (low/medium/high/critical)
6. Implement single combined review prompt
7. Set up streaming response handling
8. Implement real-time streaming UI updates
9. Store complete review in database
10. Implement notification system:
    - Dashboard notification
    - GitHub comment posting
    - Email notification (via API)
    - Webhook notification (Slack/Discord)
11. No rate limits (unlimited reviews per user)

### Deliverables
- AI review engine working
- Structured output parsing functional
- Real-time streaming to UI
- All notification channels working

---

## PHASE 6: Frontend Dashboard

### Summary
Build responsive user dashboard with repository management, PR list, and detailed review views using Strict B&W theme.

### Key Pages
1. **Login Page** (/login) - GitHub OAuth sign-in
2. **Dashboard Home** (/dashboard) - Overview of repos and recent PRs
3. **Repositories Page** (/dashboard/repos) - Add/remove repos
4. **PR List Page** (/dashboard/pr/[owner]/[repo]) - List PRs for a repo
5. **PR Detail Page** (/dashboard/pr/[owner]/[repo]/[pr]) - Detailed review view

### Key Tasks
1. Create main dashboard layout with sidebar navigation
2. Implement repositories page:
   - Display list of connected repos
   - Show repo stats (PR count, last review)
   - Add repository button (opens GitHub repo picker)
   - Remove repository button
3. Implement PR list view:
   - Filter by state (open/closed/all)
   - Sort by date or author
   - Show review status badge
   - Quick actions (view, trigger review)
4. Implement PR detail page:
   - PR metadata header (title, author, branches, changes)
   - Real-time streaming AI summary panel
   - Findings list grouped by severity (critical/high/medium/low)
   - Interactive file diff viewer
   - Inline comments section
   - Trigger review button (for manual triggering)
   - Review status indicators
5. Create loading skeletons for streaming states
6. Implement error handling and empty states
7. Add responsive design for mobile/tablet

### Deliverables
- Complete user dashboard
- Repository management functional
- PR list and detail views working
- Real-time streaming review display
- Responsive design across devices

---

## PHASE 7: UI Components

### Summary
Create reusable shadcn/ui components styled with Strict B&W theme using Lucide icons.

### Key Tasks
1. Configure shadcn/ui components with B&W theme:
   - Button (black background, white text)
   - Card (black border, white background)
   - Input (black border)
   - Badge (black/white variants)
   - Dialog, Dropdown, Table, etc.
2. Create custom components:
   - **RepoCard** - Display repo with stats
   - **PRBadge** - Status indicator (open/closed/reviewed)
   - **FindingsList** - Grouped by severity with icons
   - **FileDiffViewer** - Side-by-side diff display
   - **EmptyState** - Custom empty state designs
   - **LoadingSkeleton** - Streaming animation variants
   - **StreamingText** - Real-time text display component
3. Integrate Lucide React icons throughout:
   - GitHub, Plus, Trash, Refresh, Eye, etc.
   - Severity icons (AlertTriangle, CheckCircle, XCircle)
   - Navigation icons
4. Implement Tremor charts (if needed):
   - Line chart for review trends
   - Bar chart for findings breakdown
   - Donut chart for severity distribution
   - Area chart for usage over time
5. Create theme toggle (if needed for Strict B&W)
6. Implement consistent spacing and typography

### Deliverables
- Complete component library
- Consistent B&W theme applied
- All icons integrated
- Charts functional

---

## PHASE 8: Admin Panel

### Summary
Build comprehensive admin panel at /admin route for system management, user management, and analytics with Tremor charts.

### Admin Pages
1. **Admin Dashboard** (/admin) - System overview
2. **User Management** (/admin/users) - User list and actions
3. **Repository Management** (/admin/repos) - All repos overview
4. **Analytics** (/admin/analytics) - Charts and metrics
5. **Settings** (/admin/settings) - System configuration

### Key Tasks
1. Create admin layout with sidebar:
   - Protected route (admin users only)
   - Distinct visual style
   - Navigation links

2. Implement Admin Dashboard:
   - Stats cards (total users, repos, reviews, API usage)
   - Tremor charts (review trends, findings distribution)
   - Quick actions (view logs, manage users)

3. Implement User Management:
   - Table of all registered users
   - Search and filter functionality
   - Actions: Suspend user, Activate user, View details
   - User detail view (connected repos, review history)

4. Implement Repository Management:
   - Table of all connected repositories
   - Search by owner/name
   - Actions: Remove repo, View stats
   - Repo detail view (PR count, review stats)

5. Implement Analytics:
   - Line chart: Review volume over time
   - Bar chart: Reviews by day/week/month
   - Donut chart: Findings by severity
   - Bar chart: Top repositories by reviews
   - Stats: Average review time, completion rate
   - Export reports (CSV/PDF)

6. Implement Settings:
   - **Admin Users Tab**: Add/remove admin users
   - **AI Settings Tab**: Configure model, API keys
   - **Notifications Tab**: Configure notification channels
   - **Audit Logs Tab**: View critical admin actions

7. Implement Critical-Only Audit Logging:
   - Log user suspensions
   - Log repo removals
   - Log admin user changes
   - Log system configuration changes

### Deliverables
- Complete admin panel at /admin
- All management features working
- Analytics with Tremor charts
- Audit logging implemented

---

## PHASE 9: Docker Deployment

### Summary
Configure Docker multi-container setup for production deployment with nginx reverse proxy.

### Key Tasks
1. Create Dockerfile for Next.js application:
   - Multi-stage build (builder + runner)
   - Install dependencies
   - Build Next.js app
   - Configure for production
2. Create docker-compose.yml:
   - Next.js service
   - Optional: nginx service
   - Environment configuration
   - Volume mounts
   - Health checks
3. Set up environment variables for production:
   - Convex deployment URL
   - GitHub OAuth credentials
   - OpenRouter API key
   - Admin configuration
4. Configure nginx (optional):
   - Reverse proxy setup
   - SSL configuration
   - CORS headers
5. Add health check endpoints:
   - /api/health for Next.js
   - Container health checks
6. Create deployment documentation
7. Test Docker build and run locally

### Deliverables
- Dockerfile created
- docker-compose.yml configured
- Production deployment ready
- Documentation complete

---

## File Structure

```
pr-agent/
├── convex/
│   ├── convex.json              # Convex configuration
│   ├── schema.ts                # Database schema
│   ├── auth.ts                  # Better Auth configuration
│   └── functions/
│       ├── admin.ts             # Admin panel functions
│       ├── repos.ts             # Repository functions
│       ├── reviews.ts           # Review functions
│       ├── users.ts             # User functions
│       └── webhooks.ts          # GitHub webhook handlers
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx     # Login page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Dashboard layout
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── repos/
│   │   │   │   └── page.tsx     # Repositories page
│   │   │   └── pr/
│   │   │       └── [owner]/
│   │   │           └── [repo]/
│   │   │               └── [pr]/
│   │   │                   └── page.tsx  # PR detail page
│   │   ├── admin/
│   │   │   ├── layout.tsx       # Admin layout
│   │   │   ├── page.tsx         # Admin dashboard
│   │   │   ├── users/
│   │   │   │   └── page.tsx     # User management
│   │   │   ├── repos/
│   │   │   │   └── page.tsx     # Repo management
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx     # Analytics
│   │   │   └── settings/
│   │   │       └── page.tsx     # Settings
│   │   ├── api/
│   │   │   ├── auth/[...better-auth]/
│   │   │   │   └── route.ts     # Better Auth API
│   │   │   └── webhooks/
│   │   │       └── github/
│   │   │           └── route.ts # GitHub webhooks
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── ui/                  # Shadcn components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── admin/               # Admin components
│   │   └── charts/              # Tremor chart components
│   ├── lib/
│   │   ├── auth.ts              # Auth utilities
│   │   ├── github.ts            # GitHub API client
│   │   ├── ai.ts                # AI review engine
│   │   └── theme.ts             # B&W theme config
│   └── hooks/                   # Custom React hooks
├── scripts/
│   └── seed-admin.ts            # Admin seed script
├── Dockerfile
├── docker-compose.yml
├── bun.lockb
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Configuration Summary

| Feature | Setting |
|---------|---------|
| Repo Sources | User's Own Repos Only |
| Review Trigger | Hybrid (Auto + Manual) |
| Streaming | Yes (Real-time) |
| File Selection | Full PR |
| Rate Limits | None (Unlimited) |
| Notifications | Dashboard + GitHub + Email + Webhook |
| Tenancy | Single Tenant |
| Admin Access | Separate Route (/admin) |
| Admin Auth | DB Table (Seed Script) |
| GitHub Comments | Both (Comment + PR Review) |
| Theme | Strict Black & White |
| Package Manager | Bun |

---

## Dependencies

```json
{
  "core": {
    "next": "16.x",
    "typescript": "5.x",
    "react": "19.x"
  },
  "auth": {
    "better-auth": "^1.1.0",
    "@convex-dev/auth": "^0.0.90"
  },
  "ai": {
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^1.0.0"
  },
  "github": {
    "@octokit/rest": "^21.0.0",
    "@octokit/webhooks": "^13.0.0"
  },
  "ui": {
    "shadcn-ui": "latest",
    "lucide-react": "^0.562.0"
  },
  "db": {
    "convex": "^1.12.0"
  }
}
```

---

## Progress Tracker

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Project Setup |
| 2 | ✅ Complete | Database Schema |
| 3 | ✅ Complete | Authentication |
| 4 | ✅ Complete | GitHub Integration |
| 5 | 🚧 In Progress | AI Review Engine |
| 6 | ⏳ Pending | Frontend Dashboard |
| 7 | ⏳ Pending | UI Components |
| 8 | ⏳ Pending | Admin Panel |
| 9 | ⏳ Pending | Docker Deployment |

---

## Estimated Timeline (Updated)

| Phase | Effort | Status |
|-------|--------|--------|
| 1. Project Setup | 1-2 days | ✅ Complete |
| 2. Database Schema | 1 day | ✅ Complete |
| 3. Authentication | 1-2 days | ✅ Complete |
| 4. GitHub Integration | 2-3 days | ✅ Complete |
| 5. AI Review Engine | 2-3 days | 🚧 In Progress |
| 6. Frontend Dashboard | 3-4 days | ⏳ Pending |
| 7. UI Components | 2 days | ⏳ Pending |
| 8. Admin Panel | 3-4 days | ⏳ Pending |
| 9. Docker Deployment | 1 day | ⏳ Pending |

**Progress: 4/9 phases complete (44%)**
**Remaining: ~11-16 days estimated**

---

## Getting Started

### Prerequisites
- Bun package manager
- Node.js 18+
- GitHub OAuth App credentials
- OpenRouter API key
- Convex account

### Installation
```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize Convex
bun run convex:dev

# Run development server
bun run dev
```

### Environment Variables
```env
# Convex
CONVEX_DEPLOYMENT=<your-convex-deployment-url>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>

# Better Auth
AUTH_SECRET=<generate-with-openssl_rand_32>
AUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# OpenRouter
OPENROUTER_API_KEY=<your-openrouter-api-key>

# Admin
INITIAL_ADMIN_GITHUB_USERNAME=<your-github-username>
```
