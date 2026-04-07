"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "./supabase";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (codename: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const userId = localStorage.getItem("tongshi_user_id");
    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      localStorage.removeItem("tongshi_user_id");
      setLoading(false);
      return;
    }

    setUser(data as User);
    setLoading(false);
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Heartbeat: update last_active_at every 30s
  useEffect(() => {
    if (!user) return;

    const beat = () => {
      supabase
        .from("users")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", user.id)
        .then();
    };

    beat();
    const interval = setInterval(beat, 30_000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (codename: string): Promise<{ error?: string }> => {
    const trimmed = codename.trim();
    if (!trimmed) return { error: "请输入代号" };
    if (trimmed.length < 2) return { error: "代号至少需要2个字符" };
    if (trimmed.length > 20) return { error: "代号不能超过20个字符" };

    // Check if codename exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("codename", trimmed)
      .single();

    if (existing) {
      return { error: "这个代号已被使用，换一个试试" };
    }

    const { data, error } = await supabase
      .from("users")
      .insert({ codename: trimmed })
      .select()
      .single();

    if (error) {
      return { error: "创建失败，请重试" };
    }

    const newUser = data as User;
    localStorage.setItem("tongshi_user_id", newUser.id);
    setUser(newUser);
    return {};
  };

  const logout = () => {
    localStorage.removeItem("tongshi_user_id");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
