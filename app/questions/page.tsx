"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { supabase } from "@/lib/supabase";
import { Question, OptionKey } from "@/types";

export default function QuestionsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    const [questionsRes, answersRes] = await Promise.all([
      supabase
        .from("questions")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
      supabase.from("answers").select("*").eq("user_id", user.id),
    ]);

    if (questionsRes.data) {
      setQuestions(questionsRes.data as Question[]);
    }

    if (answersRes.data) {
      const map: Record<number, OptionKey> = {};
      for (const a of answersRes.data) {
        map[a.question_id] = a.selected_option as OptionKey;
      }
      setAnswers(map);

      // Start at first unanswered question
      if (questionsRes.data) {
        const firstUnanswered = questionsRes.data.findIndex(
          (q: Question) => !map[q.id]
        );
        if (firstUnanswered >= 0) {
          setCurrentIndex(firstUnanswered);
        }
      }
    }

    setLoadingData(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (user) loadData();
  }, [loading, user, router, loadData]);

  const saveAnswer = async (questionId: number, option: OptionKey) => {
    if (!user) return;
    setSaving(true);

    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    await supabase.from("answers").upsert(
      {
        user_id: user.id,
        question_id: questionId,
        selected_option: option,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    );

    setSaving(false);
  };

  const handleSelect = async (option: OptionKey) => {
    const q = questions[currentIndex];
    await saveAnswer(q.id, option);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    }, 300);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= questions.length && questions.length > 0;

  if (loading || loadingData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-zinc-400">加载中…</div>
      </div>
    );
  }

  if (!user) return null;

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const options: { key: OptionKey; text: string }[] = [
    { key: "A", text: currentQuestion.option_a },
    { key: "B", text: currentQuestion.option_b },
    { key: "C", text: currentQuestion.option_c },
    { key: "D", text: currentQuestion.option_d },
  ];

  const selectedOption = answers[currentQuestion.id];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
            <span>
              已答 {answeredCount} 题
            </span>
          </div>
          <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <p className="text-lg font-medium text-zinc-900 mb-6 leading-relaxed">
            {currentQuestion.prompt}
          </p>

          <div className="space-y-3">
            {options.map(({ key, text }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={saving}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                  selectedOption === key
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100"
                }`}
              >
                <span className="font-medium mr-2">{key}.</span>
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← 上一题
          </button>

          {allAnswered ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              查看结果 →
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((i) =>
                  Math.min(questions.length - 1, i + 1)
                )
              }
              disabled={currentIndex === questions.length - 1}
              className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              下一题 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
