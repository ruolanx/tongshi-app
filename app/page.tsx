"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

export default function JoinPage() {
  const { user, loading, login } = useUser();
  const [codename, setCodename] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(codename);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/questions");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-zinc-400">加载中…</div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Tongshi
          </h1>
          <p className="mt-2 text-zinc-500">我们适合做同事吗？</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <p className="text-sm text-zinc-600 mb-5">
            回答 10 个工作场景问题，看看你和其他人有多合拍。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="codename"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                你的代号
              </label>
              <input
                id="codename"
                type="text"
                value={codename}
                onChange={(e) => {
                  setCodename(e.target.value);
                  setError("");
                }}
                placeholder="给自己起个代号"
                autoFocus
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
                maxLength={20}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !codename.trim()}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "进入中…" : "进入"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          不需要注册，选个代号就能玩
        </p>
      </div>
    </div>
  );
}
