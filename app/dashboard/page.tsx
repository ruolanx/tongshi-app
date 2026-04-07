"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { supabase } from "@/lib/supabase";
import { User, Question, Answer } from "@/types";
import { UserListItem } from "@/components/user-list-item";
import { Avatar } from "@/components/avatar";
import { isOnline } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading, logout } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({});
  const [myAnswerCount, setMyAnswerCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [tab, setTab] = useState<"all" | "online">("all");

  const loadData = useCallback(async () => {
    if (!user) return;

    const [usersRes, questionsRes, answersRes] = await Promise.all([
      supabase.from("users").select("*").order("created_at", { ascending: false }),
      supabase
        .from("questions")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
      supabase.from("answers").select("user_id, question_id"),
    ]);

    if (usersRes.data) setUsers(usersRes.data as User[]);
    if (questionsRes.data) setQuestions(questionsRes.data as Question[]);

    if (answersRes.data) {
      const counts: Record<string, number> = {};
      for (const a of answersRes.data) {
        counts[a.user_id] = (counts[a.user_id] || 0) + 1;
      }
      setAnswerCounts(counts);
      setMyAnswerCount(counts[user.id] || 0);
    }

    setLoadingData(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (user) loadData();
  }, [loading, user, router, loadData]);

  // Refresh data every 30s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [user, loadData]);

  if (loading || loadingData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-zinc-400">加载中…</div>
      </div>
    );
  }

  if (!user) return null;

  const otherUsers = users.filter((u) => u.id !== user.id);
  const displayUsers =
    tab === "online"
      ? otherUsers.filter((u) => isOnline(u.last_active_at))
      : otherUsers;

  const onlineCount = otherUsers.filter((u) =>
    isOnline(u.last_active_at)
  ).length;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar codename={user.codename} size="lg" />
            <div>
              <h1 className="text-lg font-semibold text-zinc-900">
                {user.codename}
              </h1>
              <p className="text-sm text-zinc-500">
                {myAnswerCount}/{questions.length} 题已答
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {myAnswerCount < questions.length && (
              <button
                onClick={() => router.push("/questions")}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                继续答题
              </button>
            )}
            <button
              onClick={() => router.push("/questions")}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              修改答案
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-zinc-100 rounded-lg p-1">
          <button
            onClick={() => setTab("all")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "all"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            所有用户 ({otherUsers.length})
          </button>
          <button
            onClick={() => setTab("online")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "online"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
            在线 ({onlineCount})
          </button>
        </div>

        {/* User list */}
        <div className="space-y-2">
          {displayUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">
                {tab === "online"
                  ? "暂时没有其他人在线"
                  : "暂时只有你一个人"}
              </p>
              <p className="text-xs text-zinc-300 mt-1">
                把链接发给朋友试试
              </p>
            </div>
          ) : (
            displayUsers.map((u) => (
              <UserListItem
                key={u.id}
                user={u}
                answerCount={answerCounts[u.id] || 0}
                totalQuestions={questions.length}
                isCurrentUser={false}
                onCompare={() => router.push(`/compare/${u.id}`)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-zinc-200">
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
