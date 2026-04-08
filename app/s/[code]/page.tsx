"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Session, Player, Question, Answer, OptionKey } from "@/types";
import {
  getSession,
  getPlayers,
  getQuestions,
  getPlayerAnswers,
  joinSession,
  saveAnswer,
  heartbeat,
  getStoredPlayerId,
  storePlayerId,
} from "@/lib/session";
import { calculateMatch } from "@/lib/match";
import { JoinForm } from "@/components/join-form";
import { WaitingRoom } from "@/components/waiting-room";
import { QuestionFlow } from "@/components/question-flow";
import { MatchResults } from "@/components/match-results";
import { useI18n } from "@/lib/i18n";

type SessionState =
  | "loading"
  | "not_found"
  | "full"
  | "join"
  | "waiting"
  | "playing"
  | "waiting_partner_finish"
  | "results"
  | "error";

export default function SessionPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [state, setState] = useState<SessionState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [me, setMe] = useState<Player | null>(null);
  const [partner, setPartner] = useState<Player | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myAnswers, setMyAnswers] = useState<Record<number, OptionKey>>({});
  const [myAnswersList, setMyAnswersList] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [partnerAnswerCount, setPartnerAnswerCount] = useState(0);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Core data loader ---
  const loadData = useCallback(async () => {
    try {
      const sess = await getSession(code);
      if (!sess) {
        setState("not_found");
        return;
      }
      setSession(sess);

      const [players, qs] = await Promise.all([
        getPlayers(sess.id),
        getQuestions(),
      ]);
      setQuestions(qs);

      // Restore player from localStorage
      const storedId = getStoredPlayerId(code);
      const myPlayer = storedId
        ? players.find((p) => p.id === storedId) ?? null
        : null;

      if (!myPlayer) {
        if (players.length >= 2) {
          setState("full");
        } else {
          setState("join");
        }
        return;
      }

      setMe(myPlayer);
      const otherPlayer = players.find((p) => p.id !== myPlayer.id) ?? null;
      setPartner(otherPlayer);

      // Load answers
      const [myAns, partnerAns] = await Promise.all([
        getPlayerAnswers(myPlayer.id),
        otherPlayer ? getPlayerAnswers(otherPlayer.id) : Promise.resolve([]),
      ]);

      const myMap: Record<number, OptionKey> = {};
      for (const a of myAns) myMap[a.question_id] = a.selected_option;
      setMyAnswers(myMap);
      setMyAnswersList(myAns);
      setPartnerAnswers(partnerAns);
      setPartnerAnswerCount(partnerAns.length);

      const myDone = myAns.length >= qs.length;
      const partnerDone = otherPlayer ? partnerAns.length >= qs.length : false;

      if (!otherPlayer) {
        setState("waiting");
      } else if (!myDone) {
        setState("playing");
      } else if (!partnerDone) {
        setState("waiting_partner_finish");
      } else {
        setState("results");
      }
    } catch (err) {
      console.error("loadData error:", err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }, [code]);

  // --- Initial load ---
  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Polling (3s) for live updates ---
  useEffect(() => {
    if (
      state === "waiting" ||
      state === "playing" ||
      state === "waiting_partner_finish"
    ) {
      pollingRef.current = setInterval(loadData, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [state, loadData]);

  // --- Heartbeat (30s) ---
  useEffect(() => {
    if (!me) return;
    const beat = () => heartbeat(me.id);
    beat();
    heartbeatRef.current = setInterval(beat, 30_000);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [me]);

  // --- Join handler ---
  const handleJoin = async (codename: string): Promise<string | null> => {
    if (!session) return "房间不存在";
    const result = await joinSession(session.id, codename);
    if (result.error) return result.error;
    if (result.player) {
      storePlayerId(code, result.player.id);
      setMe(result.player);
      await loadData();
    }
    return null;
  };

  const { t } = useI18n();

  // --- Answer handler ---
  const handleAnswer = async (questionId: number, option: OptionKey) => {
    if (!me) return;
    setMyAnswers((prev) => ({ ...prev, [questionId]: option }));
    await saveAnswer(me.id, questionId, option);

    // Check if complete
    const newCount = Object.keys({ ...myAnswers, [questionId]: option }).length;
    if (newCount >= questions.length) {
      await loadData();
    }
  };

  // --- Render based on state ---
  if (state === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-zinc-400">{t("loading")}</div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-zinc-900">{t("error.title")}</h2>
          <p className="mt-2 text-sm text-zinc-500">{errorMsg}</p>
          <button
            onClick={() => { setState("loading"); loadData(); }}
            className="mt-4 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (state === "not_found") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🤷</div>
          <h2 className="text-lg font-semibold text-zinc-900">{t("error.not_found")}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("error.not_found_desc")}</p>
          <a href="/" className="inline-block mt-4 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">
            {t("error.create_new")}
          </a>
        </div>
      </div>
    );
  }

  if (state === "full") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-lg font-semibold text-zinc-900">{t("error.full")}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("error.full_desc")}</p>
          <a href="/" className="inline-block mt-4 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">
            {t("error.create_own")}
          </a>
        </div>
      </div>
    );
  }

  if (state === "join") {
    return <JoinForm onJoin={handleJoin} sessionCode={code} />;
  }

  if (state === "waiting" && me) {
    return <WaitingRoom sessionCode={code} codename={me.codename} />;
  }

  if (state === "playing" && me && partner) {
    return (
      <QuestionFlow
        questions={questions}
        answers={myAnswers}
        myCodename={me.codename}
        partnerCodename={partner.codename}
        partnerAnswerCount={partnerAnswerCount}
        onAnswer={handleAnswer}
      />
    );
  }

  if (state === "waiting_partner_finish" && me && partner) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h2 className="text-lg font-semibold text-zinc-900">{t("wait_finish.title")}</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {t("wait_finish.waiting").replace("…", "")}
            <span className="font-medium text-zinc-700"> {partner.codename} </span>
            {t("wait_finish.waiting").includes("…") ? "…" : ""}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {t("wait_finish.progress")}：{partnerAnswerCount}/{questions.length}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
            <span className="text-sm">{t("wait_finish.status")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (state === "results" && me && partner) {
    const result = calculateMatch(myAnswersList, partnerAnswers, questions);
    return (
      <MatchResults
        result={result}
        myCodename={me.codename}
        partnerCodename={partner.codename}
        sessionCode={code}
      />
    );
  }

  return null;
}
