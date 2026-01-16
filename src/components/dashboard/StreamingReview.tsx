"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, Zap } from "lucide-react";
import {
  getSeverityColor,
  getSeverityIcon,
  getTypeIcon,
  categorizeFindings,
} from "@/lib/ai";

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

interface StreamingReviewProps {
  repoId: string;
  prId: string;
  owner: string;
  repo: string;
  prNumber: number;
  onComplete?: (result: ReviewResult) => void;
}

export default function StreamingReview({
  repoId,
  prId,
  owner,
  repo,
  prNumber,
  onComplete,
}: StreamingReviewProps) {
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
      // TODO: Call Convex action to trigger review
      // const result = await ctx.runAction(internal.reviews.triggerReview, {...});
      
      // For demo, simulate review
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const mockResult: ReviewResult = {
        success: true,
        summary: "This PR adds a new authentication system with OAuth support. The changes look well-structured but have some security concerns around token handling.",
        findings: [
          {
            type: "security",
            file: "src/lib/auth.ts",
            line: 42,
            message: "Token expiration should be validated before processing",
            codeSnippet: "if (token.expiresAt < Date.now())",
            severity: "high",
          },
          {
            type: "bug",
            file: "src/components/Login.tsx",
            line: 78,
            message: "Missing error handling for failed OAuth callback",
            severity: "medium",
          },
          {
            type: "style",
            file: "src/lib/auth.ts",
            line: 15,
            message: "Inconsistent indentation (spaces vs tabs)",
            severity: "low",
          },
          {
            type: "suggestion",
            file: "src/lib/auth.ts",
            message: "Consider adding rate limiting for failed attempts",
            severity: "medium",
          },
        ],
        reviewTimeMs: 2500,
      };

      setResult(mockResult);
      onComplete?.(mockResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Review failed",
      });
    } finally {
      clearInterval(timer);
      setIsReviewing(false);
    }
  }, [repoId, prId, owner, repo, prNumber, onComplete]);

  const { bySeverity, byType } = result?.findings
    ? categorizeFindings(result.findings)
    : { bySeverity: { critical: 0, high: 0, medium: 0, low: 0 }, byType: { bug: 0, security: 0, style: 0, suggestion: 0, info: 0 } };

  return (
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
          <Zap className={`h-4 w-4 ${isReviewing ? "animate-pulse" : ""}`} />
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
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Review Failed</span>
              </div>
              <p className="text-red-600 mt-1">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
