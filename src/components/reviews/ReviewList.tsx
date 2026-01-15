"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DiffScoreBadge } from "./DiffScoreBadge";

interface Review {
  _id: string;
  prNumber: number;
  prTitle: string;
  prAuthor: string;
  status: string;
  diffScore?: number;
  summary?: string;
  issues?: Array<{
    type: string;
    severity: string;
  }>;
  createdAt: number;
}

interface ReviewListProps {
  repoFullName?: string;
}

export function ReviewList({ repoFullName }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [repoFullName]);

  const loadReviews = async () => {
    setIsLoading(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No reviews yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          PR reviews will appear here after you connect a repository.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Link
          key={review._id}
          href={`/dashboard/reviews/${review._id}`}
          className="block bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                  {review.status}
                </span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {review.prTitle}
                </h3>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>#{review.prNumber}</span>
                <span className="mx-2">•</span>
                <span>{review.prAuthor}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(review.createdAt)}</span>
              </div>
              {review.summary && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {review.summary}
                </p>
              )}
            </div>
            {review.diffScore !== undefined && (
              <DiffScoreBadge score={review.diffScore} size="sm" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
