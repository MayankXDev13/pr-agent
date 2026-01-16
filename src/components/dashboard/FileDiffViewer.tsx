"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileDiff, Plus, Minus } from "lucide-react";

interface FileChange {
  filename: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
}

interface FileDiffViewerProps {
  files: FileChange[];
}

export default function FileDiffViewer({ files }: FileDiffViewerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleFile = (filename: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filename)) {
      newExpanded.delete(filename);
    } else {
      newExpanded.add(filename);
    }
    setExpandedFiles(newExpanded);
    setSelectedFile(filename);
  };

  const parsePatch = (patch?: string) => {
    if (!patch) return [];
    const lines = patch.split("\n");
    const parsed: Array<{
      type: "header" | "addition" | "deletion" | "context";
      content: string;
      lineNumber?: number;
    }> = [];

    let currentLineNum = 1;

    for (const line of lines) {
      if (line.startsWith("@@")) {
        const match = line.match(/@@ -\d+(?:,\d+)? \+(\d+)/);
        if (match) {
          currentLineNum = parseInt(match[1], 10);
        }
        parsed.push({ type: "header", content: line });
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        parsed.push({ type: "addition", content: line.slice(1), lineNumber: currentLineNum++ });
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        parsed.push({ type: "deletion", content: line.slice(1), lineNumber: currentLineNum });
      } else {
        parsed.push({ type: "context", content: line, lineNumber: currentLineNum++ });
      }
    }

    return parsed;
  };

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Changed Files</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <Plus className="h-4 w-4" />
              {totalAdditions}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <Minus className="h-4 w-4" />
              {totalDeletions}
            </span>
            <span className="text-gray-600">{files.length} files</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {files.map((file) => {
          const isExpanded = expandedFiles.has(file.filename);
          const parsedPatch = parsePatch(file.patch);

          return (
            <div key={file.filename}>
              <button
                onClick={() => toggleFile(file.filename)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <FileDiff className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-sm flex-1">{file.filename}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  file.status === "added"
                    ? "bg-green-100 text-green-700"
                    : file.status === "deleted"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {file.status}
                </span>
                <span className="flex items-center gap-3 text-sm">
                  <span className="text-green-600">+{file.additions}</span>
                  <span className="text-red-600">-{file.deletions}</span>
                </span>
              </button>

              {isExpanded && (
                <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <div className="font-mono text-sm">
                    {parsedPatch.length > 0 ? (
                      <div className="space-y-0">
                        {parsedPatch.map((line, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              line.type === "addition"
                                ? "bg-green-900/30"
                                : line.type === "deletion"
                                ? "bg-red-900/30"
                                : ""
                            }`}
                          >
                            <span className="w-12 text-gray-500 select-none text-right pr-4">
                              {line.lineNumber}
                            </span>
                            <span className="w-6 text-gray-600 select-none">
                              {line.type === "addition"
                                ? "+"
                                : line.type === "deletion"
                                ? "-"
                                : " "}
                            </span>
                            <span className="flex-1 whitespace-pre-wrap break-all">
                              {line.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        No diff available. Patch information not provided.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileDiff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No files changed</p>
        </div>
      )}
    </div>
  );
}
