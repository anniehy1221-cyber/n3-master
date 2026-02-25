import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "N3 Master - 日语 N3 学习助手",
  description: "基于《Try! N3》的单词闪卡与语法词典，助力日语 N3 备考。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
          <div className="w-full max-w-md rounded-3xl bg-card shadow-lg shadow-slate-200/70 ring-1 ring-border-subtle">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
