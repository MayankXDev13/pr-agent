"use client";

import { useState } from "react";

interface QASessionProps {
  repoId: string;
  onClose?: () => void;
}

interface QASessionData {
  _id: string;
  question: string;
  answer?: string;
  status: string;
  modelUsed: string;
  tokensUsed: number;
  startedAt: number;
}

export function QASession({ repoId, onClose }: QASessionProps) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<QASessionData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId, question }),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions([newSession, ...sessions]);
        setQuestion("");
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Ask about your codebase</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sessions.map((session) => (
          <div key={session._id} className="border rounded-lg p-3">
            <div className="font-medium text-sm text-gray-600 mb-2">
              {new Date(session.startedAt).toLocaleDateString()}
            </div>
            <div className="font-medium mb-1">Q: {session.question}</div>
            {session.answer && (
              <div className="text-gray-700 text-sm whitespace-pre-wrap">
                {session.answer}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span className={`px-2 py-1 rounded ${
                session.status === "completed" ? "bg-green-100 text-green-800" : 
                session.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
              }`}>
                {session.status}
              </span>
              <span>{session.modelUsed}</span>
              {session.tokensUsed > 0 && <span>{session.tokensUsed} tokens</span>}
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No questions yet. Ask your first question about the codebase!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How does the authentication work?"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </div>
      </form>
    </div>
  );
}
