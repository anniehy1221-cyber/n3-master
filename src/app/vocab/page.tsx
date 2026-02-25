"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import vocabData from "../../../data/vocab.json";
import {
  addMasteredId,
  loadUserProgress,
  removeMasteredId,
} from "../../lib/userProgress";

type VocabItem = (typeof vocabData)[number];

export default function VocabPage() {
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | "none">(
    "none",
  );

  useEffect(() => {
    const progress = loadUserProgress();
    setMasteredIds(progress.mastered_ids);
  }, []);

  const currentItem: VocabItem | null = useMemo(() => {
    if (currentIndex >= (vocabData as VocabItem[]).length) return null;
    return (vocabData as VocabItem[])[currentIndex];
  }, [currentIndex]);

  const handleKnow = () => {
    if (!currentItem) return;
    setDirection("right");
    addMasteredId(currentItem.id);
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
    removeMasteredId(currentItem.id);
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
    setFavoriteIds((prev) =>
      prev.includes(currentItem.id)
        ? prev.filter((id) => id !== currentItem.id)
        : [...prev, currentItem.id],
    );
  };

  const masteredCount = masteredIds.length;
  const vocabItems = vocabData as VocabItem[];

  return (
    <main className="flex flex-col gap-4 px-4 py-4">
      <header className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 flex-col">
          <h1 className="text-base font-semibold text-slate-900">
            单词闪卡
          </h1>
          <p className="text-xs text-slate-600">
            点击翻面，左右划分“认识 / 不认识”。
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            已掌握
          </p>
          <p className="text-xs font-semibold text-slate-800">
            {masteredCount} / {vocabItems.length}
          </p>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {currentItem ? (
            <motion.button
              key={currentItem.id + String(isFlipped)}
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative aspect-video w-[90%] max-w-md rounded-3xl bg-card shadow-xl shadow-slate-300/80 ring-1 ring-border-subtle focus:outline-none"
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
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {!isFlipped ? (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-medium text-indigo-600">
                        正面 · 单词
                      </span>
                      <button
                        type="button"
                        className="rounded-full bg-white/80 p-1.5 text-slate-500 shadow-md shadow-slate-300/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite();
                        }}
                      >
                        {favoriteIds.includes(currentItem.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-3xl font-semibold tracking-wide text-slate-900">
                        {currentItem.kanji}
                      </p>
                      <p className="text-sm text-slate-500">
                        Tap 卡片查看读音与例句
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Tip: 向右滑 = 认识，向左滑 = 不认识（用下方按钮模拟）。
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-medium text-indigo-600">
                        背面 · 释义
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {currentItem.kanji}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {currentItem.kana}
                        </p>
                        <p className="text-sm text-slate-600">
                          {currentItem.meaningZh}
                        </p>
                      </div>
                      <div className="space-y-1 rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="text-[11px] font-medium text-slate-500">
                          例句
                        </p>
                        <p className="text-sm text-slate-900">
                          {currentItem.exampleJa}
                        </p>
                        <p className="text-xs text-slate-600">
                          {currentItem.exampleZh}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      再次点击可翻回正面。
                    </p>
                  </>
                )}
              </div>
            </motion.button>
          ) : (
            <motion.div
              className="flex aspect-video w-[90%] max-w-md flex-col items-center justify-center rounded-3xl bg-card text-center shadow-xl shadow-slate-300/80 ring-1 ring-border-subtle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-medium text-slate-900">
                今日卡片已刷完 🎉
              </p>
              <p className="mt-1 text-xs text-slate-600">
                可以回到首页查看总体进度，或稍后再来复习。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="flex items-center justify-between gap-3 pb-1">
        <button
          type="button"
          onClick={handleDontKnow}
          disabled={!currentItem}
          className="flex-1 rounded-full bg-red-50 py-2.5 text-sm font-semibold text-red-600 shadow-sm shadow-red-100 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          不认识
        </button>
        <button
          type="button"
          onClick={handleKnow}
          disabled={!currentItem}
          className="flex-1 rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm shadow-emerald-100 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          认识
        </button>
      </section>
    </main>
  );
}

