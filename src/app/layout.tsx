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
        <div className="flex min-h-screen items-center justify-center bg-[#f8f7fc] p-4 sm:p-8">
          <div className="relative w-full max-w-[430px] overflow-hidden bg-white shadow-2xl ring-1 ring-gray-100 sm:rounded-[3rem]">
            <div className="min-h-screen overflow-y-auto bg-[#fbfbfe] p-6 no-scrollbar sm:h-[850px] sm:min-h-0">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
