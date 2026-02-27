"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Search,
} from "lucide-react";
import grammarData from "../../../data/grammar.json";
import {
  getCurrentUsername,
  loadCurrentUserProgress,
  toggleMasteredGrammarId,
} from "../../lib/userProgress";

type GrammarItem = (typeof grammarData)[number];

export default function GrammarPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const username = await getCurrentUsername();
      const progress = username ? await loadCurrentUserProgress() : null;
      if (!mounted) return;
      setCurrentUser(username);
      if (progress) {
        setMasteredIds(progress.mastered_grammar_ids);
      }
      setIsReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems: GrammarItem[] = useMemo(() => {
    if (!query.trim()) return grammarData as GrammarItem[];
    const lower = query.toLowerCase();
    return (grammarData as GrammarItem[]).filter((item) => {
      return (
        item.title.toLowerCase().includes(lower) ||
        item.pattern.toLowerCase().includes(lower) ||
        item.meaningZh.toLowerCase().includes(lower)
      );
    });
  }, [query]);

  const toggleMastered = async (id: string) => {
    const next = await toggleMasteredGrammarId(id);
    setMasteredIds(next.mastered_grammar_ids);
  };

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
          <p className="mt-2 text-sm text-slate-500">登录后查看语法词典。</p>
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

  return (
    <main className="app-main">
      <header className="app-header-panel">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="app-back-btn"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 flex-col">
            <h1 className="text-xl font-bold text-[#1f2937]">语法词典</h1>
            <p className="text-xs text-slate-500">
              支持搜索与展开，快速查看接续和例句。
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">已掌握</p>
            <p className="font-mono text-sm font-bold text-[#1f2937]">{masteredIds.length} 项</p>
          </div>
        </div>
      </header>

      <section className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入语法形式 / 中文含义搜索（如：はずだ）"
          className="h-12 w-full rounded-2xl border border-[#ebe5f5] bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6d56a3]/20"
        />
      </section>

      <section className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isMastered = masteredIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-[1.8rem] border bg-white shadow-sm transition ${
                isExpanded
                  ? "border-[#d8cffa] ring-4 ring-[#6d56a3]/8"
                  : "border-[#ebe5f5]"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
                className="flex w-full items-center gap-2 px-5 py-4"
              >
                <div className="flex flex-1 flex-col items-start">
                  <div className="flex w-full items-center justify-between gap-2">
                    <p className="text-lg font-bold text-[#1f2937]">{item.title}</p>
                    <span className="rounded-full bg-[#f3f0ff] px-3 py-1 text-xs font-medium text-[#6d56a3]">
                      {item.meaningZh}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {item.pattern}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {isExpanded && (
                <div className="space-y-4 border-t border-[#ebe5f5] px-5 pb-5 pt-4 text-sm text-slate-700">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-wide text-[#6d56a3]">接续方式</p>
                    <p>{item.pattern}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-wide text-[#6d56a3]">含义 & 用法</p>
                    <p>{item.explanationZh}</p>
                  </div>
                  <div className="space-y-2 rounded-2xl bg-[#f8f7fc] p-4">
                    <p className="text-xs font-bold tracking-wide text-slate-400">例句</p>
                    <p className="font-medium text-[#1f2937]">{item.exampleJa}</p>
                    <p className="text-sm text-slate-500">{item.exampleZh}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMastered(item.id)}
                    className={`w-full rounded-xl px-4 py-2 ${
                      isMastered ? "app-warning-btn" : "app-success-btn"
                    }`}
                  >
                    <span>{isMastered ? "标记为未掌握" : "标记为已掌握"}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">
            未找到匹配的语法条目，请尝试更换关键词。
          </p>
        )}
      </section>
    </main>
  );
}

