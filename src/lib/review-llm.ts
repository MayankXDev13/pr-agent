import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const FREE_MODEL = "meta-llama/llama-3.2-3b-instruct";
const FALLBACK_MODEL = "microsoft/phi-4";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  headers: {
    "HTTP-Referer": process.env.AUTH_URL ?? "http://localhost:3000",
    "X-Title": "PR Agent",
  },
});

const FINDING_SCHEMA = z.object({
  type: z.enum(["security", "bug", "style", "breaking"]),
  file: z.string(),
  line: z.number().optional(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  message: z.string(),
  suggestion: z.string(),
  codeSnippet: z.string().optional(),
});

const REVIEW_RESPONSE_SCHEMA = z.object({
  security: z.array(FINDING_SCHEMA),
  bugs: z.array(FINDING_SCHEMA),
  style: z.array(FINDING_SCHEMA),
  breaking: z.array(FINDING_SCHEMA),
  summary: z.string(),
});

export interface ReviewContext {
  prTitle: string;
  prDescription: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  diffs: Array<{
    filename: string;
    patch: string;
    additions: number;
    deletions: number;
  }>;
  relatedCode: Array<{
    path: string;
    content: string;
  }>;
}

export interface ReviewFindings {
  security: Array<{
    file: string;
    line?: number;
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    codeSnippet?: string;
    suggestion: string;
  }>;
  bugs: Array<{
    file: string;
    line?: number;
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    codeSnippet?: string;
    suggestion: string;
  }>;
  style: Array<{
    file: string;
    line?: number;
    severity: "medium" | "low";
    title: string;
    description: string;
    codeSnippet?: string;
    suggestion: string;
  }>;
  breaking: Array<{
    file: string;
    line?: number;
    severity: "critical" | "high" | "medium";
    title: string;
    description: string;
    codeSnippet?: string;
    suggestion: string;
  }>;
}

function buildReviewPrompt(context: ReviewContext): string {
  const diffsText = context.diffs
    .map((d) => `=== ${d.filename} ===
Additions: ${d.additions}, Deletions: ${d.deletions}
${d.patch || "No diff available"}`)
    .join("\n\n");

  const relatedCodeText = context.relatedCode
    .slice(0, 10)
    .map((r) => `=== ${r.path} ===
${r.content}`)
    .join("\n\n");

  return `You are an expert code reviewer. Analyze this PR thoroughly.

PR CONTEXT:
- Title: ${context.prTitle}
- Description: ${context.prDescription || "No description"}
- Author: ${context.author}
- Base: ${context.baseBranch} <- Head: ${context.headBranch}

CHANGED FILES:
${diffsText}

REPOSITORY CONTEXT (related code for reference):
${relatedCodeText || "No related code available"}

INSTRUCTIONS:
Analyze the changes for:
1. SECURITY: SQL injection, XSS, auth bypass, hardcoded secrets, insecure deserialization, path traversal, weak crypto
2. BUGS: Logic errors, null handling, async issues, error handling gaps, race conditions
3. STYLE: Inconsistent naming, missing types, formatting issues, code duplication
4. BREAKING: API changes, removed exports, changed behavior, schema changes

For each issue found:
- Provide file path and line number
- Explain the issue clearly
- Show the problematic code
- Suggest a fix

OUTPUT:
Return ONLY valid JSON (no markdown, no explanation):
{
  "security": [
    {
      "type": "security",
      "file": "path/to/file",
      "line": 42,
      "severity": "critical|high|medium|low",
      "message": "Clear description of the security issue",
      "suggestion": "How to fix it",
      "codeSnippet": "problematic code"
    }
  ],
  "bugs": [...],
  "style": [...],
  "breaking": [...],
  "summary": "2-3 sentence overall summary"
}

Only include issues that are genuinely problematic. Do not flag stylistic preferences as high severity. Return empty arrays if no issues found in a category.`;
}

export async function analyzePR(context: ReviewContext): Promise<ReviewFindings> {
  const prompt = buildReviewPrompt(context);
  
    try {
      let text = "";
      
      try {
        const result = await generateText({
          model: openrouter(FREE_MODEL),
          prompt,
          temperature: 0.2,
        });
        text = result.text;
      } catch {
        console.warn(`Primary model ${FREE_MODEL} failed, trying fallback ${FALLBACK_MODEL}`);
        const result = await generateText({
          model: openrouter(FALLBACK_MODEL),
          prompt,
          temperature: 0.2,
        });
        text = result.text;
      }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsed = REVIEW_RESPONSE_SCHEMA.parse(JSON.parse(jsonMatch[0]));
    
    return {
      security: parsed.security.map((f) => ({
        file: f.file,
        line: f.line,
        severity: ["critical", "high", "medium", "low"].includes(f.severity) 
          ? f.severity as "critical" | "high" | "medium" | "low"
          : "medium",
        title: f.message.split("\n")[0] || "Issue",
        description: f.message,
        codeSnippet: f.codeSnippet,
        suggestion: f.suggestion,
      })),
      bugs: parsed.bugs.map((f) => ({
        file: f.file,
        line: f.line,
        severity: ["critical", "high", "medium", "low"].includes(f.severity) 
          ? f.severity as "critical" | "high" | "medium" | "low"
          : "medium",
        title: f.message.split("\n")[0] || "Issue",
        description: f.message,
        codeSnippet: f.codeSnippet,
        suggestion: f.suggestion,
      })),
      style: parsed.style.map((f) => ({
        file: f.file,
        line: f.line,
        severity: ["medium", "low"].includes(f.severity) 
          ? f.severity as "medium" | "low"
          : "low",
        title: f.message.split("\n")[0] || "Issue",
        description: f.message,
        codeSnippet: f.codeSnippet,
        suggestion: f.suggestion,
      })),
      breaking: parsed.breaking.map((f) => ({
        file: f.file,
        line: f.line,
        severity: ["critical", "high", "medium"].includes(f.severity) 
          ? f.severity as "critical" | "high" | "medium"
          : "medium",
        title: f.message.split("\n")[0] || "Issue",
        description: f.message,
        codeSnippet: f.codeSnippet,
        suggestion: f.suggestion,
      })),
    };
  } catch (error) {
    console.error("LLM analysis failed:", error);
    return {
      security: [],
      bugs: [],
      style: [],
      breaking: [],
    };
  }
}
