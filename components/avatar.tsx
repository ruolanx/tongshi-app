"use client";

import { codenameToColor } from "@/lib/utils";

export function Avatar({
  codename,
  size = "md",
}: {
  codename: string;
  size?: "sm" | "md" | "lg";
}) {
  const bg = codenameToColor(codename);
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ backgroundColor: bg }}
    >
      {codename.charAt(0).toUpperCase()}
    </div>
  );
}
