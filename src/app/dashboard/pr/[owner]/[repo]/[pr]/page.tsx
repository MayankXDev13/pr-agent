"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GitPullRequest,
  GitMerge,
  Clock,
  User,
  GitBranch,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import StreamingReview from "@/components/dashboard/StreamingReview";

export default function PRDetailPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const pr = params.pr as string;

  const [isReviewing, setIsReviewing] = useState(false);

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
              <h1 className="text-2xl font-bold">PR #{pr}: Add authentication system</h1>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Open
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                mayankxdev
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                feature/auth → main
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                opened 2 hours ago
              </span>
            </div>
          </div>
          <a
            href={`https://github.com/${owner}/${repo}/pull/${pr}`}
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
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Changed Files</h2>
            <div className="space-y-2">
              {[
                { name: "src/lib/auth.ts", additions: 45, deletions: 12 },
                { name: "src/components/Login.tsx", additions: 28, deletions: 5 },
                { name: "src/app/api/auth/route.ts", additions: 15, deletions: 3 },
                { name: "README.md", additions: 8, deletions: 2 },
              ].map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="font-mono text-sm">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">+{file.additions}</span>
                    <span className="text-red-600">-{file.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <StreamingReview
            repoId="demo-repo-id"
            prId="demo-pr-id"
            owner={owner}
            repo={repo}
            prNumber={parseInt(pr)}
          />
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">PR Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Changes</span>
                <span className="font-mono">+96 / -22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Files Changed</span>
                <span className="font-mono">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commits</span>
                <span className="font-mono">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Review Status</span>
                <span className="flex items-center gap-1 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Reviewers</h3>
            <p className="text-sm text-gray-600">No reviewers assigned yet</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
              Add reviewers
            </button>
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
