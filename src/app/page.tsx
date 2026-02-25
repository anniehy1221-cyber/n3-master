import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import vocabData from "../../data/vocab.json";
import { loadUserProgress } from "../lib/userProgress";

type VocabFromJson = (typeof vocabData)[number];

const TOTAL_VOCAB = (vocabData as VocabFromJson[]).length;

export default function Home() {
  const progressData =
    typeof window === "undefined" ? null : loadUserProgress();
  const masteredCount = progressData?.mastered_ids.length ?? 0;
  const progress = TOTAL_VOCAB
    ? Math.min(
        100,
        Math.round((masteredCount / TOTAL_VOCAB) * 100) || 0,
      )
    : 0;

  return (
    <main className="flex flex-col gap-8 px-6 py-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          N3 Master
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          日语 N3 学习助手
        </h1>
        <p className="text-sm text-slate-600">
          基于《Try! N3》的核心词汇与语法，帮助你系统备考。
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>总体学习进度</span>
          <span className="font-medium text-slate-700">
            {progress}%（已掌握 {masteredCount} / {TOTAL_VOCAB}）
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 pb-2">
        <Link
          href="/vocab"
          className="group flex aspect-[16/9] w-full items-center justify-between rounded-2xl bg-primary-soft px-5 py-4 shadow-md shadow-indigo-100/70 transition hover:shadow-xl"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-500">
              模式一
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              单词闪卡
            </h2>
            <p className="text-xs text-slate-600">
              类似 Tinder 滑动，快速区分“认识 / 不认识”。
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-indigo-300/70">
            <Sparkles className="h-6 w-6" />
          </div>
        </Link>

        <Link
          href="/grammar"
          className="group flex aspect-[16/9] w-full items-center justify-between rounded-2xl bg-card px-5 py-4 shadow-md shadow-slate-200/70 ring-1 ring-border-subtle transition hover:shadow-lg"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              模式二
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              语法词典
            </h2>
            <p className="text-xs text-slate-600">
              支持搜索与展开，随时回顾 N3 语法要点。
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-400/60">
            <BookOpen className="h-6 w-6" />
          </div>
        </Link>
      </section>
    </main>
  );
}
