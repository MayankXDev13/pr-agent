"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GitPullRequest,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  GitMerge,
} from "lucide-react";
import { useState } from "react";

interface MockPR {
  number: number;
  title: string;
  author: string;
  state: "open" | "closed";
  mergedAt?: number;
  createdAt: number;
}

const MOCK_PRS: MockPR[] = [
  {
    number: 42,
    title: "Add authentication system with OAuth support",
    author: "mayankxdev",
    state: "open",
    createdAt: Date.now() - 7200000,
  },
  {
    number: 41,
    title: "Fix memory leak in event handler",
    author: "johndoe",
    state: "open",
    createdAt: Date.now() - 86400000,
  },
  {
    number: 40,
    title: "Update dependencies",
    author: "mayankxdev",
    state: "closed",
    mergedAt: Date.now() - 172800000,
    createdAt: Date.now() - 259200000,
  },
  {
    number: 39,
    title: "Add unit tests for auth module",
    author: "mayankxdev",
    state: "closed",
    mergedAt: Date.now() - 432000000,
    createdAt: Date.now() - 518400000,
  },
  {
    number: 38,
    title: "Refactor database connection pooling",
    author: "developer2",
    state: "closed",
    createdAt: Date.now() - 604800000,
  },
];

export default function PRListPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [sortBy, setSortBy] = useState<"date" | "number">("date");

  const filteredPRs = MOCK_PRS
    .filter((pr) => filter === "all" || pr.state === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.createdAt - a.createdAt;
      }
      return b.number - a.number;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{owner}/{repo}</h1>
          <p className="text-gray-600 mt-1">Pull Requests</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="number">Sort by Number</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Stats:</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            {MOCK_PRS.filter(pr => pr.state === "open").length} Open
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {MOCK_PRS.filter(pr => pr.state === "closed").length} Closed
          </span>
        </div>
      </div>

      {filteredPRs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <GitPullRequest className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No pull requests</h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "This repository has no pull requests yet"
              : `No ${filter} pull requests`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPRs.map((pr) => (
            <Link
              key={pr.number}
              href={`/dashboard/pr/${owner}/${repo}/${pr.number}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-start gap-4">
                {pr.state === "open" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : pr.mergedAt ? (
                  <GitMerge className="h-5 w-5 text-purple-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{pr.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span>#{pr.number}</span>
                    <span>opened by {pr.author}</span>
                    <span>•</span>
                    <span>
                      {pr.mergedAt
                        ? "merged"
                        : pr.state === "closed"
                        ? "closed"
                        : "open"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(pr.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pr.state === "open" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      1 review
                    </span>
                  )}
                  {pr.mergedAt && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Merged
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
