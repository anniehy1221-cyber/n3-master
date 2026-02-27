"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, UserRound } from "lucide-react";
import vocabData from "../../../data/vocab.json";
import grammarData from "../../../data/grammar.json";
import {
  getCurrentUsername,
  loadCurrentUserProgress,
} from "../../lib/userProgress";

type VocabItem = (typeof vocabData)[number];
type GrammarItem = (typeof grammarData)[number];

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-[#6d56a3]/10 bg-[#f3f0ff]/50 px-4 py-4 text-sm text-gray-500">
      {text}
    </p>
  );
}

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    mastered_vocab_ids: [] as string[],
    favorite_vocab_ids: [] as string[],
    mastered_grammar_ids: [] as string[],
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const current = await getCurrentUsername();
      const nextProgress = current ? await loadCurrentUserProgress() : null;
      if (!mounted) return;
      setUsername(current);
      if (nextProgress) {
        setProgress(nextProgress);
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

  if (!username) {
    return (
      <main className="app-login-guard">
        <div className="app-login-guard-card">
          <h1 className="text-2xl font-bold text-[#1f2937]">请先登录</h1>
          <p className="mt-2 text-sm text-slate-500">登录后查看个人中心。</p>
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

  const vocabItems = vocabData as VocabItem[];
  const grammarItems = grammarData as GrammarItem[];

  const masteredVocab = vocabItems.filter((item) =>
    progress.mastered_vocab_ids.includes(item.id),
  );
  const favoriteVocab = vocabItems.filter((item) =>
    progress.favorite_vocab_ids.includes(item.id),
  );
  const masteredGrammar = grammarItems.filter((item) =>
    progress.mastered_grammar_ids.includes(item.id),
  );

  return (
    <main className="app-main">
      <header className="rounded-[2rem] bg-[#f3f0ff] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="app-back-btn"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#1f2937]">个人中心</h1>
              <p className="text-xs text-gray-500">{username}</p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6d56a3]">
            <UserRound className="h-5 w-5" />
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="px-2 text-lg font-bold text-[#1f2937]">已掌握单词</h2>
        {masteredVocab.length === 0 ? (
          <EmptyState text="还没有已掌握单词，去单词闪卡页开始学习吧。" />
        ) : (
          <div className="space-y-3">
            {masteredVocab.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-bold text-[#1f2937]">
                  {item.kanji}（{item.kana}）
                </p>
                <p className="text-sm text-gray-500">{item.meaningZh}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="px-2 text-lg font-bold text-[#1f2937]">已收藏单词</h2>
        {favoriteVocab.length === 0 ? (
          <EmptyState text="还没有收藏的单词，可在单词闪卡页点击书签收藏。" />
        ) : (
          <div className="space-y-3">
            {favoriteVocab.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-bold text-[#1f2937]">
                  {item.kanji}（{item.kana}）
                </p>
                <p className="text-sm text-gray-500">{item.meaningZh}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3 pb-1">
        <h2 className="px-2 text-lg font-bold text-[#1f2937]">已掌握语法</h2>
        {masteredGrammar.length === 0 ? (
          <EmptyState text="还没有已掌握语法，可在语法词典页进行标记。" />
        ) : (
          <div className="space-y-3">
            {masteredGrammar.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-bold text-[#1f2937]">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">{item.meaningZh}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

