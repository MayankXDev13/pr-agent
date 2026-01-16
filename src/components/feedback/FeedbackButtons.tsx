"use client";

import { useState } from "react";

interface FeedbackButtonsProps {
  commentId: string;
  upvotes: number;
  downvotes: number;
  onFeedback?: (feedback: "up" | "down") => void;
}

export function FeedbackButtons({
  commentId,
  upvotes,
  downvotes,
  onFeedback,
}: FeedbackButtonsProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(upvotes);
  const [downvotesCount, setDownvotesCount] = useState(downvotes);

  const handleVote = async (feedback: "up" | "down") => {
    if (loading || vote === feedback) return;

    setLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, feedback }),
      });

      if (response.ok) {
        setVote(feedback);
        if (feedback === "up") {
          setUpvotesCount((prev) => prev + 1);
        } else {
          setDownvotesCount((prev) => prev + 1);
        }
        onFeedback?.(feedback);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={() => handleVote("up")}
        disabled={loading}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
          vote === "up"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        <span>{upvotesCount}</span>
      </button>

      <button
        onClick={() => handleVote("down")}
        disabled={loading}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
          vote === "down"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>{downvotesCount}</span>
      </button>
    </div>
  );
}

interface PatternFeedbackProps {
  patternId: string;
  positiveFeedback: number;
  negativeFeedback: number;
}

export function PatternFeedback({
  patternId,
  positiveFeedback,
  negativeFeedback,
}: PatternFeedbackProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [positiveCount, setPositiveCount] = useState(positiveFeedback);
  const [negativeCount, setNegativeCount] = useState(negativeFeedback);

  const handleFeedback = async (type: "up" | "down") => {
    if (feedback === type) return;

    try {
      const response = await fetch("/api/patterns/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patternId, feedback: type }),
      });

      if (response.ok) {
        setFeedback(type);
        if (type === "up") {
          setPositiveCount((prev) => prev + 1);
        } else {
          setNegativeCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to submit pattern feedback:", error);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">Feedback:</span>
      <button
        onClick={() => handleFeedback("up")}
        className={`px-2 py-1 rounded ${
          feedback === "up" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
        }`}
      >
        👍 {positiveCount}
      </button>
      <button
        onClick={() => handleFeedback("down")}
        className={`px-2 py-1 rounded ${
          feedback === "down" ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
        }`}
      >
        👎 {negativeCount}
      </button>
    </div>
  );
}
