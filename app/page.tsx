"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();
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
            {t("app.title")}
          </h1>
          <p className="mt-2 text-lg text-zinc-500">{t("app.subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 text-left">
          <div className="space-y-3 text-sm text-zinc-600 mb-6">
            {["landing.step1", "landing.step2", "landing.step3"].map((key, i) => (
              <div key={key} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-500">
                  {i + 1}
                </span>
                <span>{t(key)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {creating ? t("landing.creating") : t("landing.create")}
          </button>
        </div>

        <p className="mt-5 text-xs text-zinc-400">{t("app.tagline")}</p>
      </div>
    </div>
  );
}
