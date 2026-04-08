import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const TIERS_ZH: Record<number, { label: string; emoji: string }> = {
  0:  { label: "职场仇人", emoji: "💀" },
  10: { label: "互相折磨", emoji: "🔪" },
  20: { label: "注定内耗", emoji: "😤" },
  30: { label: "能忍就忍", emoji: "😬" },
  40: { label: "勉强不撕", emoji: "🫠" },
  50: { label: "井水河水", emoji: "🤷" },
  60: { label: "凑合能处", emoji: "🤝" },
  70: { label: "还算顺眼", emoji: "😏" },
  80: { label: "意外合拍", emoji: "🔥" },
  90: { label: "天选搭档", emoji: "💎" },
};

const TIERS_EN: Record<number, { label: string; emoji: string }> = {
  0:  { label: "Workplace Nemesis", emoji: "💀" },
  10: { label: "HR Nightmare", emoji: "🔪" },
  20: { label: "Mutually Assured Destruction", emoji: "😤" },
  30: { label: "Passive-Aggressive Paradise", emoji: "😬" },
  40: { label: "Barely Surviving", emoji: "🫠" },
  50: { label: "Professionally Tolerable", emoji: "🤷" },
  60: { label: "Could Be Worse", emoji: "🤝" },
  70: { label: "Surprisingly Decent", emoji: "😏" },
  80: { label: "Actually Vibing", emoji: "🔥" },
  90: { label: "Dream Team", emoji: "💎" },
};

function getTier(score: number) {
  if (score >= 95) return 90;
  return Math.floor(score / 10) * 10;
}

function getColor(score: number) {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#65a30d";
  if (score >= 40) return "#d97706";
  if (score >= 20) return "#ea580c";
  return "#dc2626";
}

function hslFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const p1 = searchParams.get("p1") || "Player 1";
  const p2 = searchParams.get("p2") || "Player 2";
  const score = parseInt(searchParams.get("score") || "50", 10);
  const lang = searchParams.get("lang") || "zh";

  const tier = getTier(score);
  const tiers = lang === "en" ? TIERS_EN : TIERS_ZH;
  const { label, emoji } = tiers[tier] || tiers[50];
  const color = getColor(score);
  const subtitle = lang === "en" ? "Should we be coworkers?" : "我们适合做同事吗？";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#18181b" }}>Tongshi</span>
          <span style={{ fontSize: "16px", color: "#a1a1aa" }}>·</span>
          <span style={{ fontSize: "16px", color: "#a1a1aa" }}>{subtitle}</span>
        </div>

        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            borderRadius: "24px",
            padding: "48px 64px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e4e4e7",
            width: "900px",
          }}
        >
          {/* Avatars */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: hslFromString(p1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                {p1.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "16px", color: "#52525b", marginTop: "8px" }}>{p1}</span>
            </div>

            <span style={{ fontSize: "48px" }}>{emoji}</span>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: hslFromString(p2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                {p2.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "16px", color: "#52525b", marginTop: "8px" }}>{p2}</span>
            </div>
          </div>

          {/* Score */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "80px", fontWeight: 800, color, lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: "28px", fontWeight: 600, color, marginTop: "8px" }}>
              {label}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
