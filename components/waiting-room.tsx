"use client";

import { useState } from "react";
import { Avatar } from "./avatar";

export function WaitingRoom({
  sessionCode,
  codename,
}: {
  sessionCode: string;
  codename: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${sessionCode}`
      : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Avatar codename={codename} size="lg" />
        <h2 className="mt-3 text-lg font-semibold text-zinc-900">
          {codename}，你已加入！
        </h2>
        <p className="mt-1 text-sm text-zinc-500">等待对方加入…</p>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-zinc-200 p-5">
          <p className="text-sm text-zinc-600 mb-3">
            把这个链接发给你的朋友：
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm font-mono text-zinc-700 truncate">
              {shareUrl}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
          <span className="text-sm">等待中…</span>
        </div>
      </div>
    </div>
  );
}
