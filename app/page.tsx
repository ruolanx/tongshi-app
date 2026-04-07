"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    const session = await createSession();
    if (session) {
      router.push(`/s/${session.code}`);
    } else {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-10">
          <div className="text-5xl mb-4">👥</div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Tongshi
          </h1>
          <p className="mt-2 text-lg text-zinc-500">我们适合做同事吗？</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 text-left">
          <div className="space-y-3 text-sm text-zinc-600 mb-6">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-500">
                1
              </span>
              <span>创建房间，把链接发给你的朋友</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-500">
                2
              </span>
              <span>两个人各自回答 10 个工作场景问题</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-500">
                3
              </span>
              <span>看看你们的工作风格有多合拍</span>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {creating ? "创建中…" : "创建房间"}
          </button>
        </div>

        <p className="mt-5 text-xs text-zinc-400">
          不需要注册 · 两分钟搞定 · 结果可分享
        </p>
      </div>
    </div>
  );
}
