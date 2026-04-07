/**
 * Generate a deterministic HSL color from a string (codename).
 * Used for avatar backgrounds.
 */
export function codenameToColor(codename: string): string {
  let hash = 0;
  for (let i = 0; i < codename.length; i++) {
    hash = codename.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Format relative time for "last seen" label.
 */
export function formatLastSeen(lastActiveAt: string): string {
  const now = Date.now();
  const then = new Date(lastActiveAt).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 2) return "在线";
  if (diffMin < 60) return `${diffMin}分钟前`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
}

export function isOnline(lastActiveAt: string): boolean {
  const now = Date.now();
  const then = new Date(lastActiveAt).getTime();
  return now - then < 2 * 60_000; // 2 minutes
}

export function getOptionText(
  question: { option_a: string; option_b: string; option_c: string; option_d: string },
  option: "A" | "B" | "C" | "D"
): string {
  const map = { A: question.option_a, B: question.option_b, C: question.option_c, D: question.option_d };
  return map[option];
}
