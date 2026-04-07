"use client";

import { MatchResult, getMatchLabel, getMatchColor, getMatchBgColor } from "@/types";
import { getOptionText, getShareText } from "@/lib/utils";
import { Avatar } from "./avatar";
import { ShareButtons } from "./share-buttons";

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
  const label = getMatchLabel(result.matchScore);
  const shareUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const shareText = getShareText(myCodename, partnerCodename, result.matchScore);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Score header */}
        <div
          className={`rounded-2xl border p-8 text-center mb-6 ${getMatchBgColor(result.matchScore)}`}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="text-center">
              <Avatar codename={myCodename} size="lg" />
              <p className="text-xs text-zinc-500 mt-1">{myCodename}</p>
            </div>
            <div className="text-2xl">{label.emoji}</div>
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
            className={`text-base font-semibold ${getMatchColor(result.matchScore)}`}
          >
            {label.text}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            {result.matchingAnswers} / {result.commonAnswered} 题回答相同
          </p>
        </div>

        {/* Share */}
        <ShareButtons text={shareText} url={shareUrl} />

        {/* Per-question breakdown */}
        <h3 className="text-sm font-semibold text-zinc-500 mb-3 mt-8">
          逐题对比
        </h3>
        <div className="space-y-3">
          {result.details.map((d, i) => (
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
                  {d.question.prompt}
                </p>
                {d.isMatch ? (
                  <span className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    一致
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                    不同
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
                      ? `${d.myAnswer}. ${getOptionText(d.question, d.myAnswer)}`
                      : "—"}
                  </span>
                </div>
                <div className="rounded-lg bg-white/80 border border-zinc-100 px-3 py-2">
                  <span className="text-zinc-400 block mb-0.5 truncate">
                    {partnerCodename}
                  </span>
                  <span className="text-zinc-700">
                    {d.theirAnswer
                      ? `${d.theirAnswer}. ${getOptionText(d.question, d.theirAnswer)}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Play again */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block rounded-xl bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            再来一局
          </a>
        </div>
      </div>
    </div>
  );
}
