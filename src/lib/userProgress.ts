export type UserProgress = {
  mastered_vocab_ids: string[];
  favorite_vocab_ids: string[];
  mastered_grammar_ids: string[];
};

type StoredUser = {
  username: string;
  password: string;
  progress: UserProgress;
};

type UserMap = Record<string, StoredUser>;

const USERS_KEY = "n3_master_users";
const CURRENT_USER_KEY = "n3_master_current_user";

function emptyProgress(): UserProgress {
  return {
    mastered_vocab_ids: [],
    favorite_vocab_ids: [],
    mastered_grammar_ids: [],
  };
}

function loadUsers(): UserMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserMap;
  } catch {
    return {};
  }
}

function saveUsers(users: UserMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUsername(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function registerUser(username: string, password: string) {
  const trimmed = username.trim();
  if (!trimmed || !password.trim()) {
    return { ok: false, message: "账号和密码不能为空" as const };
  }
  const users = loadUsers();
  if (users[trimmed]) {
    return { ok: false, message: "账号已存在，请直接登录" as const };
  }
  users[trimmed] = {
    username: trimmed,
    password,
    progress: emptyProgress(),
  };
  saveUsers(users);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CURRENT_USER_KEY, trimmed);
  }
  return { ok: true, message: "注册成功" as const };
}

export function loginUser(username: string, password: string) {
  const trimmed = username.trim();
  const users = loadUsers();
  const user = users[trimmed];
  if (!user || user.password !== password) {
    return { ok: false, message: "账号或密码错误" as const };
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CURRENT_USER_KEY, trimmed);
  }
  return { ok: true, message: "登录成功" as const };
}

export function loadCurrentUserProgress(): UserProgress {
  const username = getCurrentUsername();
  if (!username) return emptyProgress();
  const users = loadUsers();
  const user = users[username];
  if (!user) return emptyProgress();
  return {
    mastered_vocab_ids: user.progress?.mastered_vocab_ids ?? [],
    favorite_vocab_ids: user.progress?.favorite_vocab_ids ?? [],
    mastered_grammar_ids: user.progress?.mastered_grammar_ids ?? [],
  };
}

function updateCurrentUserProgress(updater: (p: UserProgress) => UserProgress) {
  const username = getCurrentUsername();
  if (!username) return emptyProgress();
  const users = loadUsers();
  const user = users[username];
  if (!user) return emptyProgress();
  const nextProgress = updater({
    mastered_vocab_ids: user.progress?.mastered_vocab_ids ?? [],
    favorite_vocab_ids: user.progress?.favorite_vocab_ids ?? [],
    mastered_grammar_ids: user.progress?.mastered_grammar_ids ?? [],
  });
  users[username] = { ...user, progress: nextProgress };
  saveUsers(users);
  return nextProgress;
}

export function addMasteredVocabId(id: string) {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    mastered_vocab_ids: progress.mastered_vocab_ids.includes(id)
      ? progress.mastered_vocab_ids
      : [...progress.mastered_vocab_ids, id],
  }));
}

export function removeMasteredVocabId(id: string) {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    mastered_vocab_ids: progress.mastered_vocab_ids.filter((x) => x !== id),
  }));
}

export function toggleFavoriteVocabId(id: string) {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    favorite_vocab_ids: progress.favorite_vocab_ids.includes(id)
      ? progress.favorite_vocab_ids.filter((x) => x !== id)
      : [...progress.favorite_vocab_ids, id],
  }));
}

export function toggleMasteredGrammarId(id: string) {
  return updateCurrentUserProgress((progress) => ({
    ...progress,
    mastered_grammar_ids: progress.mastered_grammar_ids.includes(id)
      ? progress.mastered_grammar_ids.filter((x) => x !== id)
      : [...progress.mastered_grammar_ids, id],
  }));
}

