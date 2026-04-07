export interface User {
  id: string;
  codename: string;
  created_at: string;
  last_active_at: string;
}

export interface Question {
  id: number;
  order_index: number;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  is_active: boolean;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: number;
  selected_option: "A" | "B" | "C" | "D";
  created_at: string;
  updated_at: string;
}

export type OptionKey = "A" | "B" | "C" | "D";

export interface CompareResult {
  totalQuestions: number;
  commonAnswered: number;
  matchingAnswers: number;
  matchScore: number;
  details: CompareDetail[];
}

export interface CompareDetail {
  question: Question;
  myAnswer: OptionKey | null;
  theirAnswer: OptionKey | null;
  isMatch: boolean;
}

export function getMatchLabel(score: number): string {
  if (score >= 80) return "Strong match";
  if (score >= 55) return "Mixed but workable";
  return "Friction likely";
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-500";
}

export function getMatchBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 55) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}
