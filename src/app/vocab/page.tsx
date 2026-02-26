"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import vocabData from "../../../data/vocab.json";
import {
  addMasteredVocabId,
  getCurrentUsername,
  loadCurrentUserProgress,
  removeMasteredVocabId,
  toggleFavoriteVocabId,
} from "../../lib/userProgress";

type VocabItem = (typeof vocabData)[number];

export default function VocabPage() {
  const currentUser =
    typeof window === "undefined" ? null : getCurrentUsername();
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCurrentUserProgress().mastered_vocab_ids;
  });
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCurrentUserProgress().favorite_vocab_ids;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | "none">(
    "none",
  );

  const currentItem: VocabItem | null = useMemo(() => {
    if (currentIndex >= (vocabData as VocabItem[]).length) return null;
    return (vocabData as VocabItem[])[currentIndex];
  }, [currentIndex]);

  const handleKnow = () => {
    if (!currentItem) return;
    setDirection("right");
    addMasteredVocabId(currentItem.id);
    setMasteredIds((prev) =>
      prev.includes(currentItem.id) ? prev : [...prev, currentItem.id],
    );
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prev) =>
        Math.min(prev + 1, (vocabData as VocabItem[]).length),
      );
      setDirection("none");
    }, 200);
  };

  const handleDontKnow = () => {
    if (!currentItem) return;
    setDirection("left");
    removeMasteredVocabId(currentItem.id);
    setMasteredIds((prev) => prev.filter((id) => id !== currentItem.id));
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prev) =>
        Math.min(prev + 1, (vocabData as VocabItem[]).length),
      );
      setDirection("none");
    }, 200);
  };

  const toggleFavorite = () => {
    if (!currentItem) return;
    const next = toggleFavoriteVocabId(currentItem.id);
    setFavoriteIds(next.favorite_vocab_ids);
  };

  if (!currentUser) {
    return (
      <main className="app-login-guard">
        <div className="app-login-guard-card">
          <h1 className="text-2xl font-bold text-[#1f2937]">请先登录</h1>
          <p className="mt-2 text-sm text-slate-500">登录后开始单词学习。</p>
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

  const masteredCount = masteredIds.length;
  const vocabItems = vocabData as VocabItem[];

  return (
    <main className="flex h-full flex-col">
      <header className="mb-6 rounded-[2rem] bg-[#efeaff] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="app-back-btn"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#1f2937]">单词闪卡</h1>
              <p className="text-xs text-slate-500">
                点击翻面，左右划分“认识 / 不认识”
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">已掌握</p>
            <p className="font-mono text-sm font-bold text-[#1f2937]">
              {masteredCount} / {vocabItems.length}
            </p>
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center">
        <AnimatePresence initial={false} mode="popLayout">
          {currentItem ? (
            <motion.button
              key={currentItem.id + String(isFlipped)}
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative mx-auto aspect-[4/5] w-full max-w-[340px] rounded-[2.5rem] bg-white p-8 text-left shadow-xl focus:outline-none"
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: isFlipped ? 0 : 0,
              }}
              exit={{
                x: direction === "right" ? 160 : direction === "left" ? -160 : 0,
                opacity: 0,
                rotate: direction === "right" ? 12 : direction === "left" ? -12 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                {!isFlipped ? (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-[#efeaff] px-3 py-1 text-xs font-bold text-[#6d56a3]">
                        正面 · 单词
                      </span>
                      <button
                        type="button"
                        className="text-gray-300 transition hover:text-[#6d56a3]"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite();
                        }}
                      >
                        {favoriteIds.includes(currentItem.id) ? (
                          <BookmarkCheck className="h-6 w-6 text-[#6d56a3]" />
                        ) : (
                          <Bookmark className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-4 text-center">
                      <p className="text-5xl font-bold tracking-tight text-[#1f2937]">
                        {currentItem.kanji}
                      </p>
                      <p className="text-sm text-gray-400">
                        Tap 卡片查看读音与例句
                      </p>
                    </div>
                    <p className="text-center text-xs text-gray-300">
                      Tip: 向右滑 = 认识，向左滑 = 不认识（用下方按钮模拟）。
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-[#efeaff] px-3 py-1 text-xs font-bold text-[#6d56a3]">
                        背面 · 释义
                      </span>
                      <span className="text-xs font-bold tracking-widest text-gray-300">TRY!</span>
                    </div>
                    <div className="space-y-6 text-center">
                      <div className="space-y-1">
                        <p className="text-3xl font-bold text-[#1f2937]">
                          {currentItem.kana}
                        </p>
                        <p className="text-lg text-gray-500">
                          {currentItem.meaningZh}
                        </p>
                      </div>
                      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-left text-xs uppercase tracking-widest text-gray-400">例句</p>
                        <p className="text-left font-medium text-[#1f2937]">
                          {currentItem.exampleJa}
                        </p>
                        <p className="text-left text-sm text-gray-500">
                          {currentItem.exampleZh}
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-300">
                      再次点击可翻回正面。
                    </p>
                  </>
                )}
              </div>
            </motion.button>
          ) : (
            <motion.div
              className="mx-auto flex aspect-[4/5] w-full max-w-[340px] flex-col items-center justify-center rounded-[2.5rem] bg-white px-6 text-center shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-base font-medium text-slate-900">
                今日卡片已刷完 🎉
              </p>
              <p className="mt-2 text-sm text-slate-500">
                可以回到首页查看总体进度，或稍后再来复习。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6 pb-2">
        <button
          type="button"
          onClick={handleDontKnow}
          disabled={!currentItem}
          className="inline-flex h-16 items-center justify-center rounded-full border border-[#ffe0e0] bg-[#fff0f0] text-lg font-bold text-[#e05252] shadow-sm transition hover:bg-[#ffe0e0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          不认识
        </button>
        <button
          type="button"
          onClick={handleKnow}
          disabled={!currentItem}
          className="app-primary-btn h-16 rounded-full text-lg font-bold shadow-lg shadow-[#6d56a3]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          认识
        </button>
      </section>
    </main>
  );
}

