import { ReviewFindings } from "./review-llm";

export interface PRScore {
  overall: number;
  security: number;
  bugs: number;
  style: number;
}

export interface ScoreBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function calculatePRScore(findings: ReviewFindings): PRScore {
  const baseScore = 5;
  
  const severityDeduction: Record<string, number> = {
    critical: 2.0,
    high: 1.0,
    medium: 0.5,
    low: 0.1,
  };
  
  const calculateSubScore = (items: Array<{ severity: string }>): number => {
    const deduction = items.reduce(
      (sum, item) => sum + (severityDeduction[item.severity] || 0.5),
      0
    );
    return Math.max(1, baseScore - deduction);
  };
  
  const securityScore = calculateSubScore(findings.security);
  const bugScore = calculateSubScore(findings.bugs);
  const styleScore = calculateSubScore(findings.style);
  
  const breakingDeduction = findings.breaking.reduce(
    (sum, item) => sum + (severityDeduction[item.severity] || 0.5) * 1.5,
    0
  );
  
  const overallRaw = (securityScore + bugScore + styleScore) / 3 - breakingDeduction;
  const overall = Math.max(1, Math.min(5, overallRaw));
  
  return {
    overall: Math.round(overall * 10) / 10,
    security: Math.round(securityScore * 10) / 10,
    bugs: Math.round(bugScore * 10) / 10,
    style: Math.round(styleScore * 10) / 10,
  };
}

export function getScoreBreakdown(findings: ReviewFindings): ScoreBreakdown {
  return {
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
}

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Needs Improvement";
  if (score >= 1.5) return "Problematic";
  return "Critical Issues";
}

export function getScoreColor(score: number): string {
  if (score >= 4.5) return "bg-green-100 text-green-800";
  if (score >= 3.5) return "bg-blue-100 text-blue-800";
  if (score >= 2.5) return "bg-yellow-100 text-yellow-800";
  if (score >= 1.5) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function countFindings(findings: ReviewFindings): number {
  return findings.security.length + 
         findings.bugs.length + 
         findings.style.length + 
         findings.breaking.length;
}
