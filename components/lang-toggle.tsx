"use client";

import { useI18n } from "@/lib/i18n";

export function LangToggle() {
  const { t, toggle } = useI18n();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 rounded-full bg-white/80 backdrop-blur border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-white hover:border-zinc-300 shadow-sm transition-all"
    >
      {t("lang.toggle")}
    </button>
  );
}
