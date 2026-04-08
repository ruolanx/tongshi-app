"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function JoinForm({
  onJoin,
  sessionCode,
}: {
  onJoin: (codename: string) => Promise<string | null>;
  sessionCode: string;
}) {
  const { t } = useI18n();
  const [codename, setCodename] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = codename.trim();
    if (!trimmed) return;
    if (trimmed.length < 2) {
      setError(t("join.min_length"));
      return;
    }

    setError("");
    setSubmitting(true);
    const err = await onJoin(trimmed);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">👥</div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("join.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {t("join.room")}：
            <span className="font-mono font-semibold text-zinc-700">
              {sessionCode}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="codename"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("join.label")}
              </label>
              <input
                id="codename"
                type="text"
                value={codename}
                onChange={(e) => {
                  setCodename(e.target.value);
                  setError("");
                }}
                placeholder={t("join.placeholder")}
                autoFocus
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
                maxLength={20}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !codename.trim()}
              className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? t("join.joining") : t("join.button")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
