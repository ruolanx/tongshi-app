"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "zh" | "en";

interface I18nContextType {
  locale: Locale;
  t: (key: string) => string;
  toggle: () => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  t: (k) => k,
  toggle: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "zh";
    return (localStorage.getItem("tongshi_lang") as Locale) || "zh";
  });

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      localStorage.setItem("tongshi_lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = locale === "zh" ? zh : en;
      return (dict as Record<string, string>)[key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, t, toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

// ─── Chinese ────────────────────────────────────────────

const zh: Record<string, string> = {
  // App
  "app.title": "Tongshi",
  "app.subtitle": "我们适合做同事吗？",
  "app.tagline": "不需要注册 · 两分钟搞定 · 结果可分享",

  // Landing
  "landing.step1": "创建房间，把链接发给你的朋友",
  "landing.step2": "两个人各自回答 10 个工作场景问题",
  "landing.step3": "看看你们的工作风格有多合拍",
  "landing.create": "创建房间",
  "landing.creating": "创建中…",

  // Join
  "join.title": "加入房间",
  "join.room": "房间号",
  "join.label": "给自己起个代号",
  "join.placeholder": "比如：摸鱼大师",
  "join.button": "加入",
  "join.joining": "加入中…",
  "join.min_length": "代号至少 2 个字符",

  // Waiting
  "waiting.joined": "你已加入！",
  "waiting.for_partner": "等待对方加入…",
  "waiting.share_prompt": "把这个链接发给你的朋友：",
  "waiting.copy": "复制",
  "waiting.copied": "已复制",
  "waiting.status": "等待中…",

  // Questions
  "q.question_num": "第 {n} 题",
  "q.you": "你",
  "q.prev": "← 上一题",
  "q.next": "下一题 →",
  "q.done": "全部作答完毕 ✓",

  // Waiting for partner finish
  "wait_finish.title": "你已经答完了！",
  "wait_finish.waiting": "完成答题…",
  "wait_finish.progress": "对方进度",
  "wait_finish.status": "等待中…",

  // Results
  "results.same": "题回答相同",
  "results.breakdown": "逐题对比",
  "results.match": "一致",
  "results.diff": "不同",
  "results.no_answer": "—",
  "results.play_again": "再来一局",

  // Share
  "share.title": "分享结果",
  "share.copy": "复制文案",
  "share.copied": "已复制 ✓",
  "share.twitter": "分享到 𝕏",
  "share.more": "更多…",
  "share.text": "我（{me}）和 {them} 的同事匹配度是 {score}%！来测测你和朋友有多合拍 👉",

  // Errors
  "error.title": "出错了",
  "error.retry": "重试",
  "error.not_found": "房间不存在",
  "error.not_found_desc": "可能链接有误，或者房间已过期",
  "error.full": "房间已满",
  "error.full_desc": "这个房间已经有两个人了",
  "error.create_new": "创建新房间",
  "error.create_own": "创建自己的房间",
  "error.room_missing": "房间不存在",
  "error.codename_taken": "这个代号已经在房间里了",
  "error.join_failed": "加入失败，请重试",

  // Loading
  "loading": "加载中…",

  // Match tiers (10 tiers, dark humor)
  "match.tier.0":  "职场仇人",
  "match.tier.10": "互相折磨",
  "match.tier.20": "注定内耗",
  "match.tier.30": "能忍就忍",
  "match.tier.40": "勉强不撕",
  "match.tier.50": "井水河水",
  "match.tier.60": "凑合能处",
  "match.tier.70": "还算顺眼",
  "match.tier.80": "意外合拍",
  "match.tier.90": "天选搭档",

  "match.emoji.0":  "💀",
  "match.emoji.10": "🔪",
  "match.emoji.20": "😤",
  "match.emoji.30": "😬",
  "match.emoji.40": "🫠",
  "match.emoji.50": "🤷",
  "match.emoji.60": "🤝",
  "match.emoji.70": "😏",
  "match.emoji.80": "🔥",
  "match.emoji.90": "💎",

  // Lang toggle
  "lang.toggle": "EN",
};

// ─── English ────────────────────────────────────────────

const en: Record<string, string> = {
  "app.title": "Tongshi",
  "app.subtitle": "Should we be coworkers?",
  "app.tagline": "No signup · 2 minutes · Shareable results",

  "landing.step1": "Create a room and share the link with a friend",
  "landing.step2": "Both answer 10 work-scenario questions",
  "landing.step3": "See how well your work styles match",
  "landing.create": "Create Room",
  "landing.creating": "Creating…",

  "join.title": "Join Room",
  "join.room": "Room",
  "join.label": "Pick a codename",
  "join.placeholder": "e.g. SlackNinja",
  "join.button": "Join",
  "join.joining": "Joining…",
  "join.min_length": "At least 2 characters",

  "waiting.joined": "You're in!",
  "waiting.for_partner": "Waiting for your partner…",
  "waiting.share_prompt": "Share this link with your friend:",
  "waiting.copy": "Copy",
  "waiting.copied": "Copied",
  "waiting.status": "Waiting…",

  "q.question_num": "Q{n}",
  "q.you": "You",
  "q.prev": "← Prev",
  "q.next": "Next →",
  "q.done": "All done ✓",

  "wait_finish.title": "You're done!",
  "wait_finish.waiting": "finish answering…",
  "wait_finish.progress": "Their progress",
  "wait_finish.status": "Waiting…",

  "results.same": "same answers",
  "results.breakdown": "Question Breakdown",
  "results.match": "Same",
  "results.diff": "Different",
  "results.no_answer": "—",
  "results.play_again": "Play Again",

  "share.title": "Share Results",
  "share.copy": "Copy Text",
  "share.copied": "Copied ✓",
  "share.twitter": "Share on 𝕏",
  "share.more": "More…",
  "share.text": "{me} and {them} got a {score}% coworker match! Test yours 👉",

  "error.title": "Something went wrong",
  "error.retry": "Retry",
  "error.not_found": "Room not found",
  "error.not_found_desc": "This link may be invalid or the room has expired",
  "error.full": "Room is full",
  "error.full_desc": "This room already has two people",
  "error.create_new": "Create New Room",
  "error.create_own": "Create Your Own",
  "error.room_missing": "Room not found",
  "error.codename_taken": "This codename is already taken",
  "error.join_failed": "Failed to join, please try again",

  "loading": "Loading…",

  "match.tier.0":  "Workplace Nemesis",
  "match.tier.10": "HR Nightmare",
  "match.tier.20": "Mutually Assured Destruction",
  "match.tier.30": "Passive-Aggressive Paradise",
  "match.tier.40": "Barely Surviving",
  "match.tier.50": "Professionally Tolerable",
  "match.tier.60": "Could Be Worse",
  "match.tier.70": "Surprisingly Decent",
  "match.tier.80": "Actually Vibing",
  "match.tier.90": "Dream Team",

  "match.emoji.0":  "💀",
  "match.emoji.10": "🔪",
  "match.emoji.20": "😤",
  "match.emoji.30": "😬",
  "match.emoji.40": "🫠",
  "match.emoji.50": "🤷",
  "match.emoji.60": "🤝",
  "match.emoji.70": "😏",
  "match.emoji.80": "🔥",
  "match.emoji.90": "💎",

  "lang.toggle": "中文",
};
