"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GitPullRequest,
  Clock,
  User,
  GitBranch,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState, useCallback } from "react";
import FileDiffViewer from "@/src/components/dashboard/FileDiffViewer";

interface Finding {
  type: string;
  file: string;
  line?: number;
  message: string;
  codeSnippet?: string;
  severity: string;
}

interface ReviewResult {
  success: boolean;
  summary?: string;
  findings?: Finding[];
  reviewTimeMs?: number;
  error?: string;
}

interface FileChange {
  filename: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
}

const MOCK_PR = {
  _id: "demo-pr-id",
  repoId: "demo-repo-id",
  prNumber: 42,
  title: "Add authentication system with OAuth support",
  state: "open",
  author: "mayankxdev",
  baseBranch: "main",
  headBranch: "feature/auth",
  additions: 96,
  deletions: 22,
  changedFiles: 4,
  lastReviewedAt: undefined,
  createdAt: Date.now() - 7200000,
};

const MOCK_REVIEWS: any[] = [];

const MOCK_FILES: FileChange[] = [
  {
    filename: "src/lib/auth.ts",
    status: "modified",
    additions: 45,
    deletions: 12,
    patch: `@@ -10,8 +10,10 @@ import { Octokit } from "@octokit/rest";
 
 export interface AuthConfig {
   clientId: string;
   clientSecret: string;
   redirectUri: string;
+  scope: string[];
+  state: string;
 }
 
 export class GitHubAuth {
   private config: AuthConfig;
@@ -38,6 +40,10 @@ export class GitHubAuth {
     return config.redirectUri;
   }
 
+  validateState(state: string): boolean {
+    return this.config.state === state;
+  }
+
   async exchangeCodeForToken(code: string): Promise<string> {
     const response = await fetch("https://github.com/login/oauth/access_token", {
       method: "POST",
@@ -45,7 +51,7 @@ export class GitHubAuth {
         "Content-Type": "application/json",
         Accept: "application/json",
       },
-      body: JSON.stringify({ client_id, client_secret, code }),
+      body: JSON.stringify({ client_id, client_secret, code, redirect_uri }),
     });
 
     const data = await response.json();`,
  },
  {
    filename: "src/components/Login.tsx",
    status: "modified",
    additions: 28,
    deletions: 5,
    patch: `@@ -70,8 +70,15 @@ export default function LoginPage() {
     }
   };
 
+  if (error) {
+    return (
+      <div className="error">
+        Authentication failed: {error}
+      </div>
+    );
+  }
+
   return (
     <div className="login-container">
       <h1>Sign in with GitHub</h1>`,
  },
  {
    filename: "src/app/api/auth/route.ts",
    status: "modified",
    additions: 15,
    deletions: 3,
    patch: `@@ -5,10 +5,12 @@ import { GitHubAuth } from "@/lib/auth";
 
 const auth = new GitHubAuth({
   clientId: process.env.GITHUB_CLIENT_ID!,
   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
   redirectUri: process.env.AUTH_URL + "/api/auth/callback",
+  scope: ["user:email", "read:org"],
+  state: generateRandomString(32),
 });
 
 export async function GET(request: Request) {`,
  },
  {
    filename: "README.md",
    status: "modified",
    additions: 8,
    deletions: 2,
    patch: `@@ -1,5 +1,11 @@
 # PR Agent
 
+## Features
+
+- AI-powered code review
+- GitHub OAuth integration
+- Real-time streaming reviews
+- Multi-severity findings
+
 ## Getting Started
 
 \`\`\`bash
 bun install
\`\`\``,
  },
];

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "bg-green-100 text-green-800low": return " border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case "critical":
    case "high": return "🔴";
    case "medium": return "🟡";
    case "low": return "🟢";
    default: return "⚪";
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "bug": return "🐛";
    case "security": return "🔒";
    case "style": return "🎨";
    case "suggestion": return "💡";
    case "info": return "ℹ️";
    default: return "📝";
  }
}

function categorizeFindings(findings: Finding[]) {
  const bySeverity = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };
  return { bySeverity };
}

export default function PRDetailPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const prNumber = parseInt(params.pr as string);

  const pr = { ...MOCK_PR, prNumber };
  const reviews = MOCK_REVIEWS;
  const files = MOCK_FILES;

  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startReview = useCallback(async () => {
    setIsReviewing(true);
    setResult(null);
    setElapsed(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResult: ReviewResult = {
        success: true,
        summary: "This PR adds a new authentication system with OAuth support. The changes look well-structured but have some security concerns around token handling and state validation.",
        findings: [
          {
            type: "security",
            file: "src/lib/auth.ts",
            line: 42,
            message: "Token expiration should be validated before processing the OAuth response",
            codeSnippet: "if (token.expiresAt < Date.now())",
            severity: "high",
          },
          {
            type: "bug",
            file: "src/components/Login.tsx",
            line: 78,
            message: "Missing error handling for failed OAuth callback - null check needed for error parameter",
            codeSnippet: "if (error) { return <Error message={error} />; }",
            severity: "medium",
          },
          {
            type: "style",
            file: "src/lib/auth.ts",
            line: 15,
            message: "Inconsistent indentation - mixed tabs and spaces in auth.ts",
            severity: "low",
          },
          {
            type: "suggestion",
            file: "src/lib/auth.ts",
            line: 22,
            message: "Consider adding rate limiting for failed OAuth attempts to prevent abuse",
            severity: "medium",
          },
          {
            type: "security",
            file: "src/app/api/auth/route.ts",
            line: 12,
            message: "State parameter should be validated against stored session state to prevent CSRF attacks",
            codeSnippet: "const state = request.nextUrl.searchParams.get('state');",
            severity: "high",
          },
        ],
        reviewTimeMs: 2850,
      };

      setResult(mockResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Review failed",
      });
    } finally {
      clearInterval(timer);
      setIsReviewing(false);
    }
  }, []);

  const { bySeverity } = result?.findings
    ? categorizeFindings(result.findings)
    : { bySeverity: { critical: 0, high: 0, medium: 0, low: 0 } };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/pr/${owner}/${repo}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to PRs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GitPullRequest className="h-6 w-6" />
              <h1 className="text-2xl font-bold">PR #{pr.prNumber}: {pr.title}</h1>
              <span className={`px-2 py-1 text-sm rounded-full ${
                pr.state === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {pr.state}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {pr.author}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                {pr.baseBranch} → {pr.headBranch}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(pr.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <a
            href={`https://github.com/${owner}/${repo}/pull/${pr.prNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <FileDiffViewer files={files} />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">AI Code Review</h3>
                <p className="text-sm text-gray-600">
                  Powered by Llama 3.3 70B via OpenRouter
                </p>
              </div>
              <button
                onClick={startReview}
                disabled={isReviewing}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isReviewing
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <svg className={`h-4 w-4 ${isReviewing ? "animate-pulse" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isReviewing ? `Reviewing... ${elapsed}s` : "Start Review"}
              </button>
            </div>

            {isReviewing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing code changes...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {result.success ? (
                  <>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-gray-700">{result.summary}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {bySeverity.critical + bySeverity.high}
                        </div>
                        <div className="text-sm text-red-600">High Priority</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-700">
                          {bySeverity.medium}
                        </div>
                        <div className="text-sm text-yellow-600">Medium</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {bySeverity.low}
                        </div>
                        <div className="text-sm text-green-600">Low</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          {result.findings?.length || 0}
                        </div>
                        <div className="text-sm text-blue-600">Total Issues</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Findings</h4>
                      {result.findings?.map((finding, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 ${getSeverityColor(
                            finding.severity
                          )}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg">
                              {getSeverityIcon(finding.severity)}
                            </span>
                            <span className="text-lg">{getTypeIcon(finding.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium capitalize">
                                  {finding.type}
                                </span>
                                <span className="text-sm px-2 py-0.5 rounded bg-white/50 capitalize">
                                  {finding.severity}
                                </span>
                              </div>
                              <p className="text-sm">{finding.message}</p>
                              <div className="mt-2 flex items-center gap-4 text-sm opacity-75">
                                <code className="text-xs bg-white/50 px-2 py-1 rounded">
                                  {finding.file}
                                </code>
                                {finding.line && <span>Line {finding.line}</span>}
                              </div>
                              {finding.codeSnippet && (
                                <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                                  <code>{finding.codeSnippet}</code>
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500 text-right">
                      Review completed in {(result.reviewTimeMs! / 1000).toFixed(1)}s
                    </div>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">Review Failed</span>
                    </div>
                    <p className="text-red-600 mt-1">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">PR Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Additions</span>
                <span className="font-mono text-green-600">+{pr.additions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deletions</span>
                <span className="font-mono text-red-600">-{pr.deletions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Files Changed</span>
                <span className="font-mono">{pr.changedFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Review Status</span>
                {reviews.length > 0 ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Reviewed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Reviewers</h3>
            <p className="text-sm text-gray-600">No reviewers assigned yet</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Labels</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                feature
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                auth
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
