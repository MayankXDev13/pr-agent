"use client";

import { getScoreColor, getScoreLabel } from "../../lib/pr-scorer";

interface ScoreCardProps {
  score: number;
  securityScore: number;
  bugScore: number;
  styleScore: number;
}

export function ScoreCard({ score, securityScore, bugScore, styleScore }: ScoreCardProps) {
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  const stars = "⭐".repeat(Math.round(score));

  return (
    <div className={`p-6 rounded-lg ${colorClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">PR Score: {score}/5</h2>
          <p className="text-lg font-medium opacity-80">{label}</p>
          <p className="text-2xl mt-2">{stars}</p>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-75">Security</div>
          <div className="text-xl font-bold">{securityScore}/5</div>
          <div className="text-sm opacity-75 mt-2">Bugs</div>
          <div className="text-xl font-bold">{bugScore}/5</div>
          <div className="text-sm opacity-75 mt-2">Style</div>
          <div className="text-xl font-bold">{styleScore}/5</div>
        </div>
      </div>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  max?: number;
}

export function ScoreBar({ label, score, max = 5 }: ScoreBarProps) {
  const percentage = (score / max) * 100;
  const colorClass = getScoreColor(score);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}/{max}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass.replace("text-", "bg-").replace("100", "500")}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreBadgeProps {
  score: number;
  label: string;
}

export function ScoreBadge({ score, label }: ScoreBadgeProps) {
  const colorClass = getScoreColor(score);

  return (
    <span className={`px-2 py-0.5 rounded text-sm font-medium ${colorClass}`}>
      {label}: {score}
    </span>
  );
}

interface ScoreDistributionProps {
  reviews: Array<{ score: number }>;
}

export function ScoreDistributionChart({ reviews }: ScoreDistributionProps) {
  const distribution = {
    excellent: reviews.filter(r => r.score >= 4.5).length,
    good: reviews.filter(r => r.score >= 3.5 && r.score < 4.5).length,
    needsWork: reviews.filter(r => r.score >= 2.5 && r.score < 3.5).length,
    problematic: reviews.filter(r => r.score >= 1.5 && r.score < 2.5).length,
    critical: reviews.filter(r => r.score < 1.5).length,
  };

  const total = reviews.length || 1;

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h3 className="font-medium mb-3">Score Distribution</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-32 text-sm">Excellent (4.5+)</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(distribution.excellent / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{distribution.excellent}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-32 text-sm">Good (3.5-4.4)</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(distribution.good / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{distribution.good}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-32 text-sm">Needs Work (2.5-3.4)</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${(distribution.needsWork / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{distribution.needsWork}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-32 text-sm">Problematic (1.5-2.4)</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${(distribution.problematic / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{distribution.problematic}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-32 text-sm">Critical (&lt;1.5)</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${(distribution.critical / total) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{distribution.critical}</span>
        </div>
      </div>
    </div>
  );
}
