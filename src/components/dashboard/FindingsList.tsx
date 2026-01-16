"use client";

import { useState } from "react";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const TYPE_ICONS: Record<string, string> = {
  security: "🔒",
  bug: "🐛",
  style: "🎨",
  breaking: "⚠️",
};

interface Finding {
  type: string;
  file: string;
  line?: number;
  severity: string;
  message: string;
  suggestion: string;
  codeSnippet?: string;
}

interface FindingsListProps {
  findings: Finding[];
}

export function FindingsList({ findings }: FindingsListProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  
  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpanded(newExpanded);
  };

  if (findings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">✅</span>
        <p className="mt-2">No issues found</p>
      </div>
    );
  }

  const groupedBySeverity = {
    critical: findings.filter(f => f.severity === "critical"),
    high: findings.filter(f => f.severity === "high"),
    medium: findings.filter(f => f.severity === "medium"),
    low: findings.filter(f => f.severity === "low"),
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedBySeverity).map(([severity, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={severity} className="space-y-2">
            <h3 className="font-medium text-gray-700 capitalize">
              {SEVERITY_COLORS[severity].replace("100", "600").split(" ")[0]} {severity} ({items.length})
            </h3>
            
            {items.map((finding, index) => {
              const globalIndex = findings.indexOf(finding);
              const isExpanded = expanded.has(globalIndex);
              
              return (
                <div
                  key={globalIndex}
                  className={`border rounded-lg overflow-hidden ${SEVERITY_COLORS[finding.severity]}`}
                >
                  <button
                    onClick={() => toggleExpand(globalIndex)}
                    className="w-full px-4 py-3 text-left flex items-start justify-between"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{TYPE_ICONS[finding.type]}</span>
                      <div>
                        <div className="font-medium">
                          {finding.message.split("\n")[0]}
                        </div>
                        <div className="text-sm opacity-75">
                          {finding.file}{finding.line ? `:${finding.line}` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm opacity-75">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-current opacity-80">
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Description:</h4>
                        <p className="text-sm">{finding.message}</p>
                      </div>
                      
                      {finding.codeSnippet && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Code:</h4>
                          <pre className="text-xs bg-white/50 p-2 rounded overflow-x-auto">
                            <code>{finding.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Suggestion:</h4>
                        <p className="text-sm">{finding.suggestion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface FindingsSummaryProps {
  findings: Finding[];
}

export function FindingsSummary({ findings }: FindingsSummaryProps) {
  const counts = {
    security: findings.filter(f => f.type === "security").length,
    bugs: findings.filter(f => f.type === "bug").length,
    style: findings.filter(f => f.type === "style").length,
    breaking: findings.filter(f => f.type === "breaking").length,
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      {Object.entries(counts).map(([type, count]) => {
        if (count === 0) return null;
        return (
          <span key={type} className="flex items-center gap-1">
            {TYPE_ICONS[type]}
            <span className="capitalize">{type}: {count}</span>
          </span>
        );
      })}
    </div>
  );
}
