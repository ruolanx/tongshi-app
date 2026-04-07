export function codenameToColor(codename: string): string {
  let hash = 0;
  for (let i = 0; i < codename.length; i++) {
    hash = codename.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function getOptionText(
  question: { option_a: string; option_b: string; option_c: string; option_d: string },
  option: "A" | "B" | "C" | "D"
): string {
  const map = { A: question.option_a, B: question.option_b, C: question.option_c, D: question.option_d };
  return map[option];
}

export function getShareText(myCodename: string, theirCodename: string, score: number): string {
  return `我（${myCodename}）和 ${theirCodename} 的同事匹配度是 ${score}%！来测测你和朋友有多合拍 👉`;
}
