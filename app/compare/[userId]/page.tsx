"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { supabase } from "@/lib/supabase";
import { User, Question, Answer } from "@/types";
import {
  getMatchLabel,
  getMatchColor,
  getMatchBgColor,
} from "@/types";
import { calculateMatch } from "@/lib/match";
import { Avatar } from "@/components/avatar";
import { getOptionText } from "@/lib/utils";

export default function ComparePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const otherUserId = params.userId as string;

  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myAnswers, setMyAnswers] = useState<Answer[]>([]);
  const [theirAnswers, setTheirAnswers] = useState<Answer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    const [otherUserRes, questionsRes, myAnswersRes, theirAnswersRes] =
      await Promise.all([
        supabase.from("users").select("*").eq("id", otherUserId).single(),
        supabase
          .from("questions")
          .select("*")
          .eq("is_active", true)
          .order("order_index"),
        supabase.from("answers").select("*").eq("user_id", user.id),
        supabase.from("answers").select("*").eq("user_id", otherUserId),
      ]);

    if (otherUserRes.data) setOtherUser(otherUserRes.data as User);
    if (questionsRes.data) setQuestions(questionsRes.data as Question[]);
    if (myAnswersRes.data) setMyAnswers(myAnswersRes.data as Answer[]);
    if (theirAnswersRes.data) setTheirAnswers(theirAnswersRes.data as Answer[]);

    setLoadingData(false);
  }, [user, otherUserId]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (user) loadData();
  }, [loading, user, router, loadData]);

  if (loading || loadingData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-zinc-400">加载中…</div>
      </div>
    );
  }

  if (!user || !otherUser) return null;

  const result = calculateMatch(myAnswers, theirAnswers, questions);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-zinc-700 mb-4 transition-colors"
        >
          ← 返回
        </button>

        {/* Match score header */}
        <div
          className={`rounded-2xl border p-6 text-center mb-6 ${getMatchBgColor(result.matchScore)}`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar codename={user.codename} />
            <span className="text-zinc-400 text-lg">×</span>
            <Avatar codename={otherUser.codename} />
          </div>

          <div
            className={`text-4xl font-bold mb-1 ${getMatchColor(result.matchScore)}`}
          >
            {result.matchScore}%
          </div>
          <div className={`text-sm font-medium ${getMatchColor(result.matchScore)}`}>
            {getMatchLabel(result.matchScore)}
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            {result.matchingAnswers} / {result.commonAnswered} 题相同
          </div>
        </div>

        {/* Per-question comparison */}
        <h2 className="text-sm font-medium text-zinc-500 mb-3">逐题对比</h2>
        <div className="space-y-3">
          {result.details.map((detail, i) => (
            <div
              key={detail.question.id}
              className="bg-white rounded-xl border border-zinc-200 p-4"
            >
              <p className="text-sm font-medium text-zinc-900 mb-3">
                <span className="text-zinc-400 mr-1">{i + 1}.</span>
                {detail.question.prompt}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`rounded-lg px-3 py-2 ${
                    detail.isMatch
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-zinc-50 border border-zinc-200"
                  }`}
                >
                  <span className="text-zinc-400 block mb-0.5">
                    {user.codename}
                  </span>
                  <span className="text-zinc-700">
                    {detail.myAnswer
                      ? `${detail.myAnswer}. ${getOptionText(detail.question, detail.myAnswer)}`
                      : "未作答"}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    detail.isMatch
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-zinc-50 border border-zinc-200"
                  }`}
                >
                  <span className="text-zinc-400 block mb-0.5">
                    {otherUser.codename}
                  </span>
                  <span className="text-zinc-700">
                    {detail.theirAnswer
                      ? `${detail.theirAnswer}. ${getOptionText(detail.question, detail.theirAnswer)}`
                      : "未作答"}
                  </span>
                </div>
              </div>

              {detail.myAnswer && detail.theirAnswer && (
                <div className="mt-2 text-right">
                  {detail.isMatch ? (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ 一致
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">不同</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to dashboard */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            返回仪表盘
          </button>
        </div>
      </div>
    </div>
  );
}
