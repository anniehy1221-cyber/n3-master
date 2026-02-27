export type UserProgress = {
  mastered_vocab_ids: string[];
  favorite_vocab_ids: string[];
  mastered_grammar_ids: string[];
};

export function emptyProgress(): UserProgress {
  return {
    mastered_vocab_ids: [],
    favorite_vocab_ids: [],
    mastered_grammar_ids: [],
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function normalizeProgress(raw: unknown): UserProgress {
  const candidate =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    mastered_vocab_ids: normalizeStringArray(candidate.mastered_vocab_ids),
    favorite_vocab_ids: normalizeStringArray(candidate.favorite_vocab_ids),
    mastered_grammar_ids: normalizeStringArray(candidate.mastered_grammar_ids),
  };
}
