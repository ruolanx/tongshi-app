export interface Session {
  id: string;
  code: string;
  created_at: string;
}

export interface Player {
  id: string;
  session_id: string;
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
  player_id: string;
  question_id: number;
  selected_option: OptionKey;
  created_at: string;
}

export type OptionKey = "A" | "B" | "C" | "D";

export interface MatchResult {
  totalQuestions: number;
  commonAnswered: number;
  matchingAnswers: number;
  matchScore: number;
  details: MatchDetail[];
}

export interface MatchDetail {
  question: Question;
  myAnswer: OptionKey | null;
  theirAnswer: OptionKey | null;
  isMatch: boolean;
}

/**
 * Returns the tier key (0, 10, 20, ... 90) for the i18n lookup.
 * Each 10% band maps to a tier.
 */
export function getMatchTier(score: number): number {
  if (score >= 95) return 90;
  return Math.floor(score / 10) * 10;
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-amber-600";
  if (score >= 20) return "text-orange-600";
  return "text-red-600";
}

export function getMatchBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-lime-50 border-lime-200";
  if (score >= 40) return "bg-amber-50 border-amber-200";
  if (score >= 20) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}
