import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tongshi — 我们适合做同事吗？",
  description:
    "和朋友一起回答 10 个工作场景问题，看看你们的工作风格有多合拍。",
  openGraph: {
    title: "Tongshi — Should we be coworkers?",
    description:
      "Answer 10 work-scenario questions with a friend. See how well your styles match.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <I18nProvider>
          <LangToggle />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
