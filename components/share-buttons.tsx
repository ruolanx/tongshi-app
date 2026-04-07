"use client";

import { useState } from "react";

export function ShareButtons({ text, url }: { text: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${text} ${url}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitter = () => {
    const encoded = encodeURIComponent(fullText);
    window.open(
      `https://twitter.com/intent/tweet?text=${encoded}`,
      "_blank",
      "noopener"
    );
  };

  const handleWebShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ text, url });
    } catch {
      // user cancelled
    }
  };

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <p className="text-sm font-medium text-zinc-700 mb-3">分享结果</p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          {copied ? "已复制 ✓" : "复制文案"}
        </button>
        <button
          onClick={handleTwitter}
          className="flex-1 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          分享到 𝕏
        </button>
        {canShare && (
          <button
            onClick={handleWebShare}
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            更多…
          </button>
        )}
      </div>
    </div>
  );
}
