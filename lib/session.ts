import { supabase } from "./supabase";
import { Session, Player, Question, Answer } from "@/types";
import { generateCode } from "./utils";

export async function createSession(): Promise<Session | null> {
  const code = generateCode();
  const { data, error } = await supabase
    .from("sessions")
    .insert({ code })
    .select()
    .single();

  if (error) {
    // Retry once with new code on collision
    const code2 = generateCode();
    const { data: d2 } = await supabase
      .from("sessions")
      .insert({ code: code2 })
      .select()
      .single();
    return d2 as Session | null;
  }
  return data as Session;
}

export async function getSession(code: string): Promise<Session | null> {
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();
  return data as Session | null;
}

export async function getPlayers(sessionId: string): Promise<Player[]> {
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at");
  return (data ?? []) as Player[];
}

export async function joinSession(
  sessionId: string,
  codename: string
): Promise<{ player?: Player; error?: string }> {
  const players = await getPlayers(sessionId);

  if (players.length >= 2) {
    return { error: "房间已满" };
  }

  if (players.some((p) => p.codename === codename)) {
    return { error: "这个代号已经在房间里了" };
  }

  const { data, error } = await supabase
    .from("players")
    .insert({ session_id: sessionId, codename })
    .select()
    .single();

  if (error) return { error: "加入失败，请重试" };
  return { player: data as Player };
}

export async function getQuestions(): Promise<Question[]> {
  const { data } = await supabase
    .from("questions")
    .select("*")
    .eq("is_active", true)
    .order("order_index");
  return (data ?? []) as Question[];
}

export async function getPlayerAnswers(playerId: string): Promise<Answer[]> {
  const { data } = await supabase
    .from("answers")
    .select("*")
    .eq("player_id", playerId);
  return (data ?? []) as Answer[];
}

export async function saveAnswer(
  playerId: string,
  questionId: number,
  option: "A" | "B" | "C" | "D"
) {
  await supabase.from("answers").upsert(
    {
      player_id: playerId,
      question_id: questionId,
      selected_option: option,
    },
    { onConflict: "player_id,question_id" }
  );
}

export async function heartbeat(playerId: string) {
  await supabase
    .from("players")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", playerId);
}

// localStorage helpers — keyed per session
export function getStoredPlayerId(sessionCode: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`tongshi_${sessionCode}`);
}

export function storePlayerId(sessionCode: string, playerId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`tongshi_${sessionCode}`, playerId);
}
