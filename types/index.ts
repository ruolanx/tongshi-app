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

export function getMatchLabel(score: number): { text: string; emoji: string } {
  if (score >= 80) return { text: "默契搭档", emoji: "🔥" };
  if (score >= 55) return { text: "磨合空间", emoji: "🤝" };
  return { text: "火花四溅", emoji: "⚡" };
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 55) return "text-amber-600";
  return "text-rose-500";
}

export function getMatchBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 55) return "bg-amber-50 border-amber-200";
  return "bg-rose-50 border-rose-200";
}
