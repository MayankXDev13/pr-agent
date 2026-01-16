import { z } from "zod";

const MODEL = "meta-llama/llama-3.3-70b-instruct";
const OPENROUTER_API = "https://openrouter.ai/api/v1";

const FINDING_SCHEMA = z.object({
  type: z.enum(["bug", "security", "style", "suggestion", "info"]),
  file: z.string(),
  line: z.number().optional(),
  message: z.string(),
  codeSnippet: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

const REVIEW_SCHEMA = z.object({
  summary: z.string(),
  findings: z.array(FINDING_SCHEMA),
});

export interface ReviewInput {
  title: string;
  description: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  files: Array<{
    filename: string;
    patch?: string;
    additions: number;
    deletions: number;
  }>;
}

async function callOpenRouter(prompt: string): Promise<string> {
  const response = await fetch(OPENROUTER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.AUTH_URL || "http://localhost:3000",
      "X-Title": "PR Agent",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8192,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

export async function generateReview(input: ReviewInput): Promise<{
  success: boolean;
  modelUsed?: string;
  summary?: string;
  findings?: Array<{
    type: string;
    file: string;
    line?: number;
    message: string;
    codeSnippet?: string;
    severity: string;
  }>;
  reviewTimeMs?: number;
  error?: string;
}> {
  const filesContent = input.files
    .map(
      (file) => `
=== ${file.filename} ===
Additions: ${file.additions}, Deletions: ${file.deletions}
${file.patch || "No diff available"}
`
    )
    .join("\n");

  const prompt = `You are an expert code reviewer. Analyze this PR and provide a detailed review.

PR Title: ${input.title}
Author: ${input.author}
Base: ${input.baseBranch} <- Head: ${input.headBranch}

Description: ${input.description || "No description"}

Files Changed:
${filesContent}

Provide ONLY valid JSON (no markdown, no explanation):
{
  "summary": "2-3 sentence summary",
  "findings": [
    {
      "type": "bug|security|style|suggestion|info",
      "file": "path/to/file",
      "line": 42,
      "message": "Explanation",
      "codeSnippet": "code if applicable",
      "severity": "low|medium|high|critical"
    }
  ]
}

Focus on actionable bugs, security issues, and improvements. Be thorough but concise. Only output valid JSON.`;

  const startTime = Date.now();

  try {
    const text = await callOpenRouter(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const object = REVIEW_SCHEMA.parse(JSON.parse(jsonMatch[0]));
    const reviewTimeMs = Date.now() - startTime;

    return {
      success: true,
      modelUsed: MODEL,
      summary: object.summary,
      findings: object.findings.map((f) => ({
        ...f,
        codeSnippet: f.codeSnippet || undefined,
        line: f.line || undefined,
      })),
      reviewTimeMs,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate review",
      reviewTimeMs: Date.now() - startTime,
    };
  }
}

export function categorizeFindings(findings: Array<{
  type: string;
  severity: string;
}>) {
  const bySeverity = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };

  const byType = {
    bug: findings.filter((f) => f.type === "bug").length,
    security: findings.filter((f) => f.type === "security").length,
    style: findings.filter((f) => f.type === "style").length,
    suggestion: findings.filter((f) => f.type === "suggestion").length,
    info: findings.filter((f) => f.type === "info").length,
  };

  return { bySeverity, byType };
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getSeverityIcon(severity: string): string {
  switch (severity) {
    case "critical":
    case "high": return "🔴";
    case "medium": return "🟡";
    case "low": return "🟢";
    default: return "⚪";
  }
}

export function getTypeIcon(type: string): string {
  switch (type) {
    case "bug": return "🐛";
    case "security": return "🔒";
    case "style": return "🎨";
    case "suggestion": return "💡";
    case "info": return "ℹ️";
    default: return "📝";
  }
}
