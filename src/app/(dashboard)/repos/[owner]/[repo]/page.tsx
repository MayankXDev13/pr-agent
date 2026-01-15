"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// IndexingStatus will be enabled after Convex deployment
// import { IndexingStatus } from "../../../../components/repos/IndexingStatus";

interface RepoPageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default function RepoPage({ params }: RepoPageProps) {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isIndexing, setIsIndexing] = useState(false);
  const [repoData, setRepoData] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setOwner(p.owner);
      setRepoName(p.repo);
      loadRepo(p.owner, p.repo);
    });
  }, [params]);

  const loadRepo = async (owner: string, repo: string) => {
    setIsLoading(false);
  };

  const handleStartIndexing = async () => {
    setIsIndexing(true);
    // Convex mutation will be called here
    setTimeout(() => {
      setIsIndexing(false);
      setRepoData({
        ...repoData,
        indexingStatus: { state: "completed", progress: 100, filesCount: 150, lastIndexedAt: Date.now() },
      });
    }, 2000);
  };

  const handleRemove = () => {
    if (confirm(`Remove ${owner}/${repoName}?`)) {
      router.push("/dashboard/repos");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/repos")}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
        >
          ← Back to Repositories
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {owner}/{repoName}
            </h1>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 text-sm"
          >
            Remove Repository
          </button>
        </div>
      </div>

      {/* Indexing Status */}
      {/* IndexingStatus component will be enabled after Convex deployment */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Code Indexing
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Index your codebase to enable context-aware code reviews and Q&A.
          </p>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Indexing status will be available after Convex deployment.
          </p>
          <button
            onClick={handleStartIndexing}
            disabled={isIndexing}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isIndexing ? "Indexing..." : "Start Indexing"}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href={`/dashboard/reviews?repo=${owner}/${repoName}`}
          className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            View Reviews
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            See PR reviews for this repository
          </p>
        </a>

        <a
          href={`/dashboard/ask?repo=${owner}/${repoName}`}
          className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Ask About Code
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get AI-powered answers about this codebase
          </p>
        </a>

        <a
          href={`https://github.com/${owner}/${repoName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            View on GitHub
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Open this repository on GitHub
          </p>
        </a>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
          Phase 3: Code Indexing
        </h3>
        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          Indexing pipeline is set up. Configure NOMIC_API_KEY in .env.local to enable embeddings.
        </p>
      </div>
    </div>
  );
}
