"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import { ReviewCard, ReviewFilters } from "../../../components/dashboard/ReviewCard";
import { ScoreDistributionChart } from "../../../components/dashboard/ScoreCard";

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

const MOCK_REVIEWS: Review[] = [
  {
    _id: "1",
    score: 4.2,
    securityScore: 4.5,
    bugScore: 4.0,
    styleScore: 4.2,
    summary: "Good PR with minor style suggestions. Security looks solid with proper input validation.",
    findings: [
      { type: "style", severity: "low" },
      { type: "style", severity: "low" },
    ],
    createdAt: Date.now() - 3600000,
    repoFullName: "MayankXDev13/pr-agent",
    prNumber: 42,
  },
  {
    _id: "2",
    score: 3.5,
    securityScore: 3.5,
    bugScore: 4.0,
    styleScore: 3.0,
    summary: "Several security issues found. Missing input validation on user data.",
    findings: [
      { type: "security", severity: "medium" },
      { type: "bug", severity: "medium" },
      { type: "style", severity: "medium" },
    ],
    createdAt: Date.now() - 7200000,
    repoFullName: "MayankXDev13/pr-agent",
    prNumber: 41,
  },
  {
    _id: "3",
    score: 4.8,
    securityScore: 5.0,
    bugScore: 4.5,
    styleScore: 5.0,
    summary: "Excellent PR with clean code and proper security practices.",
    findings: [],
    createdAt: Date.now() - 86400000,
    repoFullName: "MayankXDev13/portfolio",
    prNumber: 15,
  },
  {
    _id: "4",
    score: 2.5,
    securityScore: 2.0,
    bugScore: 3.0,
    styleScore: 2.5,
    summary: "Multiple security vulnerabilities detected including SQL injection risk.",
    findings: [
      { type: "security", severity: "high" },
      { type: "security", severity: "medium" },
      { type: "bug", severity: "high" },
    ],
    createdAt: Date.now() - 172800000,
    repoFullName: "MayankXDev13/pr-agent",
    prNumber: 40,
  },
];

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    minScore?: number;
    severity?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Connect to Convex query
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReviews(MOCK_REVIEWS);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = searchQuery === "" ||
      review.repoFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesScore = !filters.minScore || review.score >= filters.minScore;
    
    const matchesSeverity = !filters.severity || 
      review.findings.some(f => f.severity === filters.severity);
    
    return matchesSearch && matchesScore && matchesSeverity;
  });

  const sortedReviews = [...filteredReviews].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Review History</h1>
          <p className="text-gray-600 mt-1">
            View past PR reviews and their scores
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 border rounded-lg hover:bg-gray-50 ${
                    showFilters ? "bg-gray-100" : ""
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {showFilters && (
                <ReviewFilters
                  onFilterChange={(newFilters: { minScore?: number; severity?: string }) => 
                    setFilters(newFilters)
                  }
                />
              )}

              {sortedReviews.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">No reviews found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ScoreDistributionChart reviews={reviews} />
              
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-medium mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-medium">
                      {(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical Issues</span>
                    <span className="font-medium text-red-600">
                      {reviews.reduce((sum, r) => 
                        sum + r.findings.filter(f => f.severity === "critical").length, 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
