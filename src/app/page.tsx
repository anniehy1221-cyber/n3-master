"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Sparkles, UserRound } from "lucide-react";
import vocabData from "../../data/vocab.json";
import {
  getCurrentUsername,
  loadCurrentUserProgress,
  logoutUser,
  UserProgress,
} from "../lib/userProgress";

type VocabFromJson = (typeof vocabData)[number];

const TOTAL_VOCAB = (vocabData as VocabFromJson[]).length;

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<UserProgress>({
    mastered_vocab_ids: [],
    favorite_vocab_ids: [],
    mastered_grammar_ids: [],
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const username = await getCurrentUsername();
      const progress = username ? await loadCurrentUserProgress() : null;
      if (!mounted) return;
      setCurrentUser(username);
      if (progress) {
        setProgressData(progress);
      }
      setIsReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isReady) {
    return (
      <main className="app-main flex min-h-full items-center justify-center">
        <p className="text-sm text-slate-500">加载中...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="app-login-guard">
        <div className="app-login-guard-card">
          <h1 className="text-2xl font-bold text-[#1f2937]">请先登录</h1>
          <p className="mt-2 text-sm text-slate-500">登录后可查看个人学习进度与收藏。</p>
          <Link
            href="/login"
            className="app-primary-btn mt-5"
          >
            去登录
          </Link>
        </div>
      </main>
    );
  }

  const masteredCount = progressData.mastered_vocab_ids.length;
  const favoriteVocabCount = progressData.favorite_vocab_ids.length;
  const masteredGrammarCount = progressData.mastered_grammar_ids.length;
  const progress = TOTAL_VOCAB
    ? Math.min(
        100,
        Math.round((masteredCount / TOTAL_VOCAB) * 100) || 0,
      )
    : 0;

  return (
    <main className="app-main">
      <header className="rounded-full bg-[#f3f0ff] px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold tracking-[0.24em] text-[#6d56a3]">
            N3 MASTER
          </p>
          <button
            type="button"
            onClick={async () => {
              await logoutUser();
              router.push("/login");
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-[#6d56a3]"
          >
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>
      </header>

      <section className="space-y-2">
        <h1 className="app-title">日语 N3 学习助手</h1>
        <p className="text-sm leading-relaxed text-slate-500">
          欢迎你，{currentUser}。基于《Try! N3》的核心词汇与语法，帮助你系统备考。
        </p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">总体学习进度</span>
          <span className="font-medium text-[#6d56a3]">
            {progress}% <span className="text-slate-400">（{masteredCount} / {TOTAL_VOCAB}）</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#6d56a3] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-blue-50 p-4 text-center">
          <p className="text-[11px] text-blue-700/80">已掌握单词</p>
          <p className="text-xl font-bold text-blue-700">{masteredCount}</p>
        </div>
        <div className="rounded-2xl bg-pink-50 p-4 text-center">
          <p className="text-[11px] text-pink-700/80">已收藏单词</p>
          <p className="text-xl font-bold text-pink-700">{favoriteVocabCount}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-center">
          <p className="text-[11px] text-emerald-700/80">已掌握语法</p>
          <p className="text-xl font-bold text-emerald-700">{masteredGrammarCount}</p>
        </div>
      </section>

      <Link
        href="/profile"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3 font-medium text-indigo-600 transition hover:bg-indigo-100"
      >
        <UserRound className="h-4 w-4" />
        进入个人中心
      </Link>

      <section className="space-y-4">
        <Link
          href="/vocab"
          className="group relative flex h-44 overflow-hidden rounded-[2rem] bg-orange-50 p-7 transition hover:bg-orange-100"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-400">模式一</p>
            <h2 className="text-3xl font-bold text-orange-900">单词闪卡</h2>
            <p className="max-w-[75%] text-sm text-orange-700/70">
              仅展示未认识单词，使用“上一个 / 认识 / 下一个”高效复习。
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition group-hover:scale-105">
            <Sparkles className="h-6 w-6" />
          </div>
        </Link>

        <Link
          href="/grammar"
          className="group relative flex h-44 overflow-hidden rounded-[2rem] bg-sky-50 p-7 transition hover:bg-sky-100"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-sky-400">模式二</p>
            <h2 className="text-3xl font-bold text-sky-900">语法词典</h2>
            <p className="max-w-[75%] text-sm text-sky-700/70">
              支持搜索与展开，随时回顾 N3 语法要点。
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/20 transition group-hover:scale-105">
            <BookOpen className="h-6 w-6" />
          </div>
        </Link>
      </section>
    </main>
  );
}
