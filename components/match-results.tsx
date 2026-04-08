"use client";

import { MatchResult, getMatchTier, getMatchColor, getMatchBgColor } from "@/types";
import { getOptionText } from "@/lib/utils";
import { Avatar } from "./avatar";
import { ShareButtons } from "./share-buttons";
import { useI18n } from "@/lib/i18n";
import { SEED_QUESTIONS_EN } from "@/seed/questions";
import type { Question } from "@/types";

function localizedQuestion(q: Question, idx: number, locale: string) {
  if (locale === "en" && SEED_QUESTIONS_EN[idx]) {
    const en = SEED_QUESTIONS_EN[idx];
    return { ...q, prompt: en.prompt, option_a: en.option_a, option_b: en.option_b, option_c: en.option_c, option_d: en.option_d };
  }
  return q;
}

export function MatchResults({
  result,
  myCodename,
  partnerCodename,
  sessionCode,
}: {
  result: MatchResult;
  myCodename: string;
  partnerCodename: string;
  sessionCode: string;
}) {
  const { t, locale } = useI18n();
  const tier = getMatchTier(result.matchScore);
  const tierLabel = t(`match.tier.${tier}`);
  const tierEmoji = t(`match.emoji.${tier}`);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = origin;
  const shareText = t("share.text")
    .replace("{me}", myCodename)
    .replace("{them}", partnerCodename)
    .replace("{score}", String(result.matchScore));

  const ogUrl = `${origin}/api/og?p1=${encodeURIComponent(myCodename)}&p2=${encodeURIComponent(partnerCodename)}&score=${result.matchScore}&lang=${locale}`;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Preview card image */}
        <div className="mb-4 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogUrl} alt="Match result card" className="w-full" />
        </div>

        {/* Score header */}
        <div
          className={`rounded-2xl border p-8 text-center mb-6 ${getMatchBgColor(result.matchScore)}`}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="text-center">
              <Avatar codename={myCodename} size="lg" />
              <p className="text-xs text-zinc-500 mt-1">{myCodename}</p>
            </div>
            <div className="text-3xl">{tierEmoji}</div>
            <div className="text-center">
              <Avatar codename={partnerCodename} size="lg" />
              <p className="text-xs text-zinc-500 mt-1">{partnerCodename}</p>
            </div>
          </div>

          <div
            className={`text-5xl font-bold mb-2 ${getMatchColor(result.matchScore)}`}
          >
            {result.matchScore}%
          </div>
          <div
            className={`text-lg font-semibold ${getMatchColor(result.matchScore)}`}
          >
            {tierLabel}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            {result.matchingAnswers} / {result.commonAnswered} {t("results.same")}
          </p>
        </div>

        {/* Share */}
        <ShareButtons text={shareText} url={shareUrl} ogUrl={ogUrl} />

        {/* Per-question breakdown */}
        <h3 className="text-sm font-semibold text-zinc-500 mb-3 mt-8">
          {t("results.breakdown")}
        </h3>
        <div className="space-y-3">
          {result.details.map((d, i) => {
            const lq = localizedQuestion(d.question, i, locale);
            return (
              <div
                key={d.question.id}
                className={`rounded-xl border p-4 ${
                  d.isMatch
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm font-medium text-zinc-800 leading-snug">
                    <span className="text-zinc-400">{i + 1}.</span>{" "}
                    {lq.prompt}
                  </p>
                  {d.isMatch ? (
                    <span className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {t("results.match")}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {t("results.diff")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white/80 border border-zinc-100 px-3 py-2">
                    <span className="text-zinc-400 block mb-0.5 truncate">
                      {myCodename}
                    </span>
                    <span className="text-zinc-700">
                      {d.myAnswer
                        ? `${d.myAnswer}. ${getOptionText(lq, d.myAnswer)}`
                        : t("results.no_answer")}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/80 border border-zinc-100 px-3 py-2">
                    <span className="text-zinc-400 block mb-0.5 truncate">
                      {partnerCodename}
                    </span>
                    <span className="text-zinc-700">
                      {d.theirAnswer
                        ? `${d.theirAnswer}. ${getOptionText(lq, d.theirAnswer)}`
                        : t("results.no_answer")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Play again */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block rounded-xl bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            {t("results.play_again")}
          </a>
        </div>
      </div>
    </div>
  );
}
