import { emptyProgress, normalizeProgress, type UserProgress } from "./progress";

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function normalizePassword(password: string): string {
  return password.trim();
}

export function sanitizeProgressInput(raw: unknown): UserProgress {
  return normalizeProgress(raw);
}

export function progressForResponse(raw: unknown): UserProgress {
  return normalizeProgress(raw) ?? emptyProgress();
}
