import { emptyProgress, normalizeProgress, type UserProgress } from "./progress";

type AuthResult = {
  ok: boolean;
  message: string;
};

type LocalStoredUser = {
  username?: string;
  password?: string;
  progress?: unknown;
};

const USERS_KEY = "n3_master_users";
const CURRENT_USER_KEY = "n3_master_current_user";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "include",
      cache: "no-store",
    });
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function readLocalUsersForMigration(): Record<string, LocalStoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, LocalStoredUser>;
  } catch {
    return {};
  }
}

export async function migrateLocalStorageToCloud(): Promise<{
  ok: boolean;
  createdCount: number;
}> {
  if (typeof window === "undefined") return { ok: false, createdCount: 0 };
  const users = readLocalUsersForMigration();
  const currentUsername = window.localStorage.getItem(CURRENT_USER_KEY);
  const result = await requestJson<{ ok: boolean; createdCount?: number }>(
    "/api/migrate/localstorage",
    {
      method: "POST",
      body: JSON.stringify({ users, currentUsername }),
    },
  );
  if (!result?.ok) return { ok: false, createdCount: 0 };
  window.localStorage.removeItem(USERS_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  return { ok: true, createdCount: result.createdCount ?? 0 };
}

export async function getCurrentUsername(): Promise<string | null> {
  const result = await requestJson<{ ok: boolean; username?: string | null }>(
    "/api/auth/me",
  );
  if (!result?.ok) return null;
  return result.username ?? null;
}

export async function logoutUser(): Promise<void> {
  await requestJson<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function registerUser(
  username: string,
  password: string,
): Promise<AuthResult> {
  const result = await requestJson<AuthResult>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return result ?? { ok: false, message: "注册失败，请稍后重试" };
}

export async function loginUser(
  username: string,
  password: string,
): Promise<AuthResult> {
  const result = await requestJson<AuthResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return result ?? { ok: false, message: "登录失败，请稍后重试" };
}

export async function loadCurrentUserProgress(): Promise<UserProgress> {
  const result = await requestJson<{
    ok: boolean;
    progress?: unknown;
  }>("/api/progress");
  if (!result?.ok) return emptyProgress();
  return normalizeProgress(result.progress);
}

async function saveCurrentUserProgress(
  progress: UserProgress,
): Promise<UserProgress> {
  const result = await requestJson<{
    ok: boolean;
    progress?: unknown;
  }>("/api/progress", {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });
  if (!result?.ok) return progress;
  return normalizeProgress(result.progress);
}

async function updateCurrentUserProgress(
  updater: (p: UserProgress) => UserProgress,
): Promise<UserProgress> {
  const current = await loadCurrentUserProgress();
  const next = updater(current);
  return saveCurrentUserProgress(next);
}

export async function addMasteredVocabId(id: string): Promise<UserProgress> {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    mastered_vocab_ids: progress.mastered_vocab_ids.includes(id)
      ? progress.mastered_vocab_ids
      : [...progress.mastered_vocab_ids, id],
  }));
}

export async function toggleFavoriteVocabId(id: string): Promise<UserProgress> {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    favorite_vocab_ids: progress.favorite_vocab_ids.includes(id)
      ? progress.favorite_vocab_ids.filter((x) => x !== id)
      : [...progress.favorite_vocab_ids, id],
  }));
}

export async function toggleMasteredGrammarId(id: string): Promise<UserProgress> {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    mastered_grammar_ids: progress.mastered_grammar_ids.includes(id)
      ? progress.mastered_grammar_ids.filter((x) => x !== id)
      : [...progress.mastered_grammar_ids, id],
  }));
}

export type { UserProgress };

