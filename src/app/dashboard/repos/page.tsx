"use client";

import { useState, useEffect } from "react";
import { Plus, FolderGit2, Trash2, ExternalLink, Loader2, RefreshCw } from "lucide-react";

interface Repo {
  _id: string;
  fullName: string;
  owner: string;
  name: string;
  description?: string;
  language?: string;
  private: boolean;
  webhookInstalled: boolean;
}

export default function ReposPage() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Fetch from Convex
      setRepos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repos");
    } finally {
      setLoading(false);
    }
  };

  const syncFromGitHub = async () => {
    setSyncing(true);
    setError(null);
    try {
      // TODO: Call Convex sync function
      await fetchRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const removeRepo = async (repoId: string) => {
    if (!confirm("Are you sure you want to remove this repository?")) return;
    
    try {
      // TODO: Call Convex remove function
      await fetchRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

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
            onClick={() => {
              /* TODO: Open repo picker modal */
            }}
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
          <button
            onClick={syncFromGitHub}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Sync from GitHub
          </button>
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
                  <h3 className="font-medium">{repo.fullName}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {repo.language && <span>{repo.language}</span>}
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-black transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  onClick={() => removeRepo(repo._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
