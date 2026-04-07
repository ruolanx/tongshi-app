"use client";

import { User } from "@/types";
import { Avatar } from "./avatar";
import { isOnline, formatLastSeen } from "@/lib/utils";

export function UserListItem({
  user,
  answerCount,
  totalQuestions,
  onCompare,
  isCurrentUser,
}: {
  user: User;
  answerCount: number;
  totalQuestions: number;
  onCompare?: () => void;
  isCurrentUser: boolean;
}) {
  const online = isOnline(user.last_active_at);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors">
      <div className="relative">
        <Avatar codename={user.codename} />
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 truncate">
            {user.codename}
          </span>
          {isCurrentUser && (
            <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">
              你
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
          <span>
            {answerCount}/{totalQuestions} 题
          </span>
          <span>·</span>
          <span>{online ? "在线" : formatLastSeen(user.last_active_at)}</span>
        </div>
      </div>

      {!isCurrentUser && (
        <button
          onClick={onCompare}
          className="shrink-0 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
        >
          对比
        </button>
      )}
    </div>
  );
}
