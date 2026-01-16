"use client";

import Link from "next/link";
import { getScoreColor, getScoreLabel } from "../../lib/pr-scorer";

interface Review {
  _id: string;
  score: number;
  securityScore: number;
  bugScore: number;
  styleScore: number;
  summary: string;
  findings: Array<{
    type: string;
    severity: string;
  }>;
  createdAt: number;
  repoFullName?: string;
  prNumber?: number;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const scoreColor = getScoreColor(review.score);
  const label = getScoreLabel(review.score);
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const criticalCount = review.findings.filter(f => f.severity === "critical").length;
  const highCount = review.findings.filter(f => f.severity === "high").length;
  const mediumCount = review.findings.filter(f => f.severity === "medium").length;

  return (
    <Link
      href={review.repoFullName && review.prNumber 
        ? `/dashboard/pr/${review.repoFullName}/${review.prNumber}`
        : "#"
      }
      className="block"
    >
      <div className="border rounded-lg p-4 hover:border-gray-400 transition-colors bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {review.repoFullName && review.prNumber && (
                <span className="text-sm text-gray-600">
                  {review.repoFullName} #{review.prNumber}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-sm font-medium ${scoreColor}`}>
                {review.score}/5 ⭐ {label}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {review.summary.replace(/[#*`]/g, "").substring(0, 200)}
            </p>
            
            <div className="flex items-center gap-4 mt-3">
              <ScoreBadge score={review.securityScore} label="Security" />
              <ScoreBadge score={review.bugScore} label="Bugs" />
              <ScoreBadge score={review.styleScore} label="Style" />
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-sm">
              {criticalCount > 0 && (
                <span className="text-red-600 font-medium">
                  {criticalCount} critical
                </span>
              )}
              {highCount > 0 && (
                <span className="text-orange-600 font-medium">
                  {highCount} high
                </span>
              )}
              {mediumCount > 0 && (
                <span className="text-yellow-600 font-medium">
                  {mediumCount} medium
                </span>
              )}
              <span className="text-gray-500 ml-auto">
                {date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const colorClass = getScoreColor(score);
  
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${colorClass}`}>
      {label}: {score}
    </span>
  );
}

interface ReviewFiltersProps {
  onFilterChange: (filters: {
    minScore?: number;
    maxScore?: number;
    severity?: string;
  }) => void;
}

export function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Min Score:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) => onFilterChange({
            minScore: e.target.value ? Number(e.target.value) : undefined,
          })}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Severity:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) => onFilterChange({
            severity: e.target.value || undefined,
          })}
        >
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
