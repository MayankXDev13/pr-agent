"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RepoCardProps {
  repo: {
    _id: string;
    fullName: string;
    owner: string;
    name: string;
    description?: string;
    indexingStatus?: {
      state: string;
      progress: number;
      filesCount?: number;
    };
    createdAt: number;
  };
  onRemove: (id: string) => void;
}

export function RepoCard({ repo, onRemove }: RepoCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!confirm(`Remove ${repo.fullName}? This will delete all indexed code.`)) {
      return;
    }
    setIsRemoving(true);
    try {
      await onRemove(repo._id);
    } finally {
      setIsRemoving(false);
    }
  };

  const getStatusColor = () => {
    switch (repo.indexingStatus?.state) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "indexing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {repo.fullName}
              </h3>
            </div>
            {repo.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                {repo.description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {repo.indexingStatus?.state === "completed"
                ? "Indexed"
                : repo.indexingStatus?.state === "indexing"
                ? `Indexing ${repo.indexingStatus.progress}%`
                : repo.indexingStatus?.state === "failed"
                ? "Failed"
                : "Not indexed"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Added {formatDate(repo.createdAt)}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/dashboard/repos/${repo.owner}/${repo.name}`)}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View
            </button>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
