import { PRScore, getScoreLabel, getScoreBreakdown } from "./pr-scorer";
import { ReviewFindings } from "./review-llm";

const SEVERITY_EMOJI: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

const TYPE_ICON: Record<string, string> = {
  security: "🔒",
  bug: "🐛",
  style: "🎨",
  breaking: "⚠️",
};

export interface InlineComment {
  path: string;
  line: number;
  body: string;
  side?: "LEFT" | "RIGHT";
}

export function generateInlineComments(findings: ReviewFindings): InlineComment[] {
  const comments: InlineComment[] = [];
  
  for (const finding of findings.security) {
    comments.push({
      path: finding.file,
      line: finding.line || 1,
      body: formatFindingComment(finding, "security"),
      side: "RIGHT",
    });
  }
  
  for (const finding of findings.bugs) {
    comments.push({
      path: finding.file,
      line: finding.line || 1,
      body: formatFindingComment(finding, "bug"),
      side: "RIGHT",
    });
  }
  
  for (const finding of findings.style) {
    comments.push({
      path: finding.file,
      line: finding.line || 1,
      body: formatFindingComment(finding, "style"),
      side: "RIGHT",
    });
  }
  
  for (const finding of findings.breaking) {
    comments.push({
      path: finding.file,
      line: finding.line || 1,
      body: formatFindingComment(finding, "breaking"),
      side: "RIGHT",
    });
  }
  
  return comments;
}

function formatFindingComment(
  finding: {
    title: string;
    description: string;
    suggestion: string;
    codeSnippet?: string;
    severity: string;
  },
  type: string
): string {
  return `${SEVERITY_EMOJI[finding.severity]} **${TYPE_ICON[type]} ${finding.title}**

${finding.description}

${finding.codeSnippet ? `\`\`\`
${finding.codeSnippet}
\`\`\`

` : ""}**Suggestion:**
${finding.suggestion}

---
*AI Code Review*`;
}

export function generateSummaryComment(
  score: PRScore,
  findings: ReviewFindings,
  prTitle?: string
): string {
  const breakdown = {
    critical: findings.security.filter(f => f.severity === "critical").length +
                findings.bugs.filter(f => f.severity === "critical").length +
                findings.breaking.filter(f => f.severity === "critical").length,
    high: findings.security.filter(f => f.severity === "high").length +
          findings.bugs.filter(f => f.severity === "high").length +
          findings.breaking.filter(f => f.severity === "high").length,
    medium: findings.security.filter(f => f.severity === "medium").length +
            findings.bugs.filter(f => f.severity === "medium").length +
            findings.style.filter(f => f.severity === "medium").length +
            findings.breaking.filter(f => f.severity === "medium").length,
    low: findings.security.filter(f => f.severity === "low").length +
         findings.bugs.filter(f => f.severity === "low").length +
         findings.style.filter(f => f.severity === "low").length,
  };
  
  const totalFindings = breakdown.critical + breakdown.high + breakdown.medium + breakdown.low;
  const label = getScoreLabel(score.overall);
  
  const formatFindingTitle = (f: { severity: string; title: string }) => `- ${SEVERITY_EMOJI[f.severity]} ${f.title}`;
  
  return `# PR Review Summary

## 📊 Score: ${score.overall}/5 ⭐ ${label}

| Category | Score |
|----------|-------|
| Security | ${score.security}/5 |
| Bugs | ${score.bugs}/5 |
| Style | ${score.style}/5 |

## Issues Found
${SEVERITY_EMOJI.critical} Critical: ${breakdown.critical}
${SEVERITY_EMOJI.high} High: ${breakdown.high}
${SEVERITY_EMOJI.medium} Medium: ${breakdown.medium}
${SEVERITY_EMOJI.low} Low: ${breakdown.low}

**Total: ${totalFindings} issues**

${totalFindings > 0 ? `
## Key Issues
${findings.security.slice(0, 3).map(formatFindingTitle).join("\n")}
${findings.bugs.slice(0, 2).map(formatFindingTitle).join("\n")}
` : "No significant issues found."}

---
*Reviewed by AI Code Review Agent*
*Detailed review available in dashboard*`;
}

export function flattenFindings(findings: ReviewFindings) {
  type FindingWithType = (typeof findings.security)[0] & { type: "security" } |
                         (typeof findings.bugs)[0] & { type: "bug" } |
                         (typeof findings.style)[0] & { type: "style" } |
                         (typeof findings.breaking)[0] & { type: "breaking" };
  
  return [
    ...findings.security.map(f => ({ ...f, type: "security" as const })),
    ...findings.bugs.map(f => ({ ...f, type: "bug" as const })),
    ...findings.style.map(f => ({ ...f, type: "style" as const })),
    ...findings.breaking.map(f => ({ ...f, type: "breaking" as const })),
  ] as FindingWithType[];
}
