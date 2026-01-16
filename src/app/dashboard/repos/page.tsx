"use client";

import { useState } from "react";
import { Plus, FolderGit2, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function ReposPage() {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<Array<{
    id: string;
    name: string;
    fullName: string;
    description: string;
    stars: number;
    language: string;
  }>>([]);

  const addRepo = async () => {
    setLoading(true);
    // TODO: Implement add repo
    setLoading(false);
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
        <button
          onClick={addRepo}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Repository
        </button>
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <FolderGit2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No repositories connected</h3>
          <p className="text-gray-600 mb-4">
            Add your first repository to start getting AI-powered code reviews
          </p>
          <button
            onClick={addRepo}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Add Repository
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FolderGit2 className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="font-medium">{repo.fullName}</h3>
                  <p className="text-sm text-gray-600">
                    {repo.description || "No description"}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{repo.language}</span>
                    <span>⭐ {repo.stars}</span>
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
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
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
