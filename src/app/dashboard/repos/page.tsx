"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, FolderGit2, Trash2, ExternalLink, Loader2, RefreshCw, Github } from "lucide-react";

interface Repo {
  _id: string;
  fullName: string;
  owner: string;
  name: string;
  description?: string;
  language?: string;
  private: boolean;
  webhookInstalled: boolean;
  prCount?: number;
  lastActivity?: number;
}

const MOCK_REPOS: Repo[] = [
  {
    _id: "repo-1",
    fullName: "MayankXDev13/pr-agent",
    owner: "MayankXDev13",
    name: "pr-agent",
    description: "AI-powered PR review agent",
    language: "TypeScript",
    private: false,
    webhookInstalled: true,
    prCount: 5,
    lastActivity: Date.now() - 3600000,
  },
  {
    _id: "repo-2",
    fullName: "MayankXDev13/portfolio",
    owner: "MayankXDev13",
    name: "portfolio",
    description: "Personal portfolio website",
    language: "React",
    private: false,
    webhookInstalled: false,
    prCount: 12,
    lastActivity: Date.now() - 86400000,
  },
  {
    _id: "repo-3",
    fullName: "MayankXDev13/learning-dashboard",
    owner: "MayankXDev13",
    name: "learning-dashboard",
    description: "Learning progress tracker",
    language: "Python",
    private: true,
    webhookInstalled: false,
    prCount: 3,
    lastActivity: Date.now() - 172800000,
  },
];

export default function ReposPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRepoPicker, setShowRepoPicker] = useState(false);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Connect to Convex query "listByUserId"
      // const convex = createClient();
      // const userRepos = await convex.query("listByUserId", { userId: userId });
      // setRepos(userRepos);

      // Mock data for demo
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRepos(MOCK_REPOS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repos");
    } finally {
      setLoading(false);
    }
  }, []);

  const syncFromGitHub = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      // TODO: Call Convex action "syncFromGitHub"
      // await convex.action("syncFromGitHub", { userId, accessToken });
      await fetchRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }, [fetchRepos]);

  const removeRepo = useCallback(async (repoId: string) => {
    if (!confirm("Are you sure you want to remove this repository?")) return;

    try {
      // TODO: Call Convex mutation "repos.remove"
      // await convex.mutation("repos.remove", { id: repoId });
      setRepos((prev) => prev.filter((r) => r._id !== repoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    }
  }, []);

  const addRepo = useCallback(async (fullName: string) => {
    try {
      // TODO: Call Convex mutation "repos.add"
      // await convex.mutation("repos.add", { ... });
      await fetchRepos();
      setShowRepoPicker(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add repo");
    }
  }, [fetchRepos]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const formatLastActivity = (timestamp?: number) => {
    if (!timestamp) return "Never";
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <p className="text-gray-600 mt-1">
            Manage your connected repositories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={syncFromGitHub}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync from GitHub
          </button>
          <button
            onClick={() => setShowRepoPicker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Repository
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <FolderGit2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No repositories connected</h3>
          <p className="text-gray-600 mb-4">
            Sync from your GitHub account or add repositories manually
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={syncFromGitHub}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Sync from GitHub
            </button>
            <button
              onClick={() => setShowRepoPicker(true)}
              className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {repos.map((repo) => (
            <div
              key={repo._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FolderGit2 className="h-8 w-8 text-gray-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{repo.fullName}</h3>
                    {repo.private && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        Private
                      </span>
                    )}
                    {repo.webhookInstalled && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        Webhook Active
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        {repo.language}
                      </span>
                    )}
                    <span>{repo.prCount || 0} PRs</span>
                    <span>Active {formatLastActivity(repo.lastActivity)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-black transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a
                  href={`/dashboard/pr/${repo.owner}/${repo.name}`}
                  className="p-2 text-gray-600 hover:text-black transition-colors"
                  title="View Pull Requests"
                >
                  <Github className="h-5 w-5" />
                </a>
                <button
                  onClick={() => removeRepo(repo._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Remove repository"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRepoPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Repository</h2>
            <p className="text-gray-600 mb-4">
              Enter the full repository name (owner/repo)
            </p>
            <input
              type="text"
              placeholder="owner/repository"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black mb-4"
              id="repo-input"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRepoPicker(false)}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById("repo-input") as HTMLInputElement;
                  if (input?.value) {
                    addRepo(input.value);
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add Repository
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
