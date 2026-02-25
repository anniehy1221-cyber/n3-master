export type UserProgress = {
  mastered_ids: string[]; // 已掌握的单词 ID
  favorite_ids: string[]; // 收藏的语法 ID
};

const STORAGE_KEY = "user_progress";

function getEmptyProgress(): UserProgress {
  return {
    mastered_ids: [],
    favorite_ids: [],
  };
}

export function loadUserProgress(): UserProgress {
  if (typeof window === "undefined") return getEmptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      mastered_ids: parsed.mastered_ids ?? [],
      favorite_ids: parsed.favorite_ids ?? [],
    };
  } catch {
    return getEmptyProgress();
  }
}

export function saveUserProgress(progress: UserProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addMasteredId(id: string) {
  const current = loadUserProgress();
  if (current.mastered_ids.includes(id)) {
    return;
  }
  const next: UserProgress = {
    ...current,
    mastered_ids: [...current.mastered_ids, id],
  };
  saveUserProgress(next);
}

export function removeMasteredId(id: string) {
  const current = loadUserProgress();
  const next: UserProgress = {
    ...current,
    mastered_ids: current.mastered_ids.filter((x) => x !== id),
  };
  saveUserProgress(next);
}

export function toggleFavoriteGrammarId(id: string): UserProgress {
  const current = loadUserProgress();
  const exists = current.favorite_ids.includes(id);
  const next: UserProgress = {
    ...current,
    favorite_ids: exists
      ? current.favorite_ids.filter((x) => x !== id)
      : [...current.favorite_ids, id],
  };
  saveUserProgress(next);
  return next;
}

