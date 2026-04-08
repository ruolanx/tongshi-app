"use client";

import { useState } from "react";
import { Question, OptionKey } from "@/types";
import { Avatar } from "./avatar";
import { useI18n } from "@/lib/i18n";
import { SEED_QUESTIONS_EN } from "@/seed/questions";

export function QuestionFlow({
  questions,
  answers,
  partnerCodename,
  partnerAnswerCount,
  myCodename,
  onAnswer,
}: {
  questions: Question[];
  answers: Record<number, OptionKey>;
  partnerCodename: string;
  partnerAnswerCount: number;
  myCodename: string;
  onAnswer: (questionId: number, option: OptionKey) => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const first = questions.findIndex((q) => !answers[q.id]);
    return first >= 0 ? first : 0;
  });
  const [saving, setSaving] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const question = questions[currentIndex];
  if (!question) return null;

  // Use English question text if locale is EN
  const enQ = locale === "en" ? SEED_QUESTIONS_EN[currentIndex] : null;
  const prompt = enQ?.prompt ?? question.prompt;
  const optionTexts = {
    A: enQ?.option_a ?? question.option_a,
    B: enQ?.option_b ?? question.option_b,
    C: enQ?.option_c ?? question.option_c,
    D: enQ?.option_d ?? question.option_d,
  };

  const options: { key: OptionKey; text: string }[] = [
    { key: "A", text: optionTexts.A },
    { key: "B", text: optionTexts.B },
    { key: "C", text: optionTexts.C },
    { key: "D", text: optionTexts.D },
  ];

  const selected = answers[question.id];

  const handleSelect = async (key: OptionKey) => {
    setSaving(true);
    await onAnswer(question.id, key);
    setSaving(false);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    }, 250);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg">
        {/* Partner status bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Avatar codename={myCodename} size="sm" />
            <span className="text-xs text-zinc-500">
              {t("q.you")} {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {partnerCodename} {partnerAnswerCount}/{questions.length}
            </span>
            <Avatar codename={partnerCodename} size="sm" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden relative">
            <div
              className="absolute h-full bg-zinc-900 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
            <div
              className="absolute h-full bg-zinc-300 rounded-full transition-all duration-300"
              style={{
                width: `${(partnerAnswerCount / questions.length) * 100}%`,
                opacity: 0.5,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="text-xs text-zinc-400 mb-2">
            {t("q.question_num").replace("{n}", String(currentIndex + 1))}
          </div>
          <p className="text-lg font-medium text-zinc-900 mb-6 leading-relaxed">
            {prompt}
          </p>

          <div className="space-y-2.5">
            {options.map(({ key, text }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={saving}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                  selected === key
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100"
                }`}
              >
                <span className="font-semibold mr-2 opacity-50">{key}</span>
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t("q.prev")}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-200 transition-colors"
            >
              {t("q.next")}
            </button>
          ) : answeredCount >= questions.length ? (
            <div className="text-xs text-emerald-600 font-medium">
              {t("q.done")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
