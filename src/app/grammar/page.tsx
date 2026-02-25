"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Search,
  Star,
  StarOff,
} from "lucide-react";
import grammarData from "../../../data/grammar.json";
import {
  loadUserProgress,
  toggleFavoriteGrammarId,
} from "../../lib/userProgress";

type GrammarItem = (typeof grammarData)[number];

export default function GrammarPage() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    const progress = loadUserProgress();
    setFavoriteIds(progress.favorite_ids);
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

  const toggleFavorite = (id: string) => {
    const next = toggleFavoriteGrammarId(id);
    setFavoriteIds(next.favorite_ids);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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
            语法词典
          </h1>
          <p className="text-xs text-slate-600">
            支持搜索与展开，快速查看接续和例句。
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            收藏
          </p>
          <p className="text-xs font-semibold text-slate-800">
            {favoriteIds.length} 项
          </p>
        </div>
      </header>

      <section className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 ring-1 ring-border-subtle">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入语法形式 / 中文含义搜索（如：はずだ）"
          className="h-7 flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </section>

      <section className="flex-1 space-y-2 pb-2">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isFavorite = favoriteIds.includes(item.id);
          const isMastered = masteredIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-slate-50/80 ring-1 ring-border-subtle"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
                className="flex w-full items-center gap-2 px-3 py-2.5"
              >
                <div className="flex flex-1 flex-col items-start">
                  <div className="flex w-full items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {item.meaningZh}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                    {item.pattern}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-400 shadow-sm shadow-slate-200"
                >
                  {isFavorite ? (
                    <Star className="h-3.5 w-3.5 fill-amber-300" />
                  ) : (
                    <StarOff className="h-3.5 w-3.5" />
                  )}
                </button>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {isExpanded && (
                <div className="space-y-2 border-t border-slate-200 bg-white px-3 py-3 text-xs text-slate-700">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-500">
                      接续方式
                    </p>
                    <p>{item.pattern}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-500">
                      含义 & 用法
                    </p>
                    <p>{item.explanationZh}</p>
                  </div>
                  <div className="space-y-1 rounded-2xl bg-slate-50 px-3 py-2">
                    <p className="text-[11px] font-semibold text-slate-500">
                      例句
                    </p>
                    <p className="text-slate-900">{item.exampleJa}</p>
                    <p className="text-[11px] text-slate-600">
                      {item.exampleZh}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMastered(item.id)}
                    className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-medium text-indigo-600"
                  >
                    <span>{isMastered ? "标记为未掌握" : "标记为已掌握"}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-500">
            未找到匹配的语法条目，请尝试更换关键词。
          </p>
        )}
      </section>
    </main>
  );
}

