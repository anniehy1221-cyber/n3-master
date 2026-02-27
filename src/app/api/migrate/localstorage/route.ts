import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import {
  normalizePassword,
  normalizeUsername,
  sanitizeProgressInput,
} from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type LocalStoredUser = {
  username?: string;
  password?: string;
  progress?: unknown;
};

type MigrationBody = {
  users?: Record<string, LocalStoredUser>;
  currentUsername?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MigrationBody;
    const users = body.users ?? {};
    const supabase = getSupabaseServerClient();

    let createdCount = 0;
    for (const user of Object.values(users)) {
      const username = normalizeUsername(user.username ?? "");
      const password = normalizePassword(user.password ?? "");
      if (!username || !password) continue;

      const { data: existing } = await supabase
        .from("app_users")
        .select("id")
        .eq("username", username)
        .maybeSingle();
      if (existing) continue;

      const passwordHash = await hash(password, 10);
      const { data: insertedUser, error: userInsertError } = await supabase
        .from("app_users")
        .insert({ username, password_hash: passwordHash })
        .select("id")
        .single();
      if (userInsertError || !insertedUser) continue;

      const progress = sanitizeProgressInput(user.progress);
      const { error: progressError } = await supabase.from("user_progress").upsert({
        user_id: insertedUser.id,
        mastered_vocab_ids: progress.mastered_vocab_ids,
        favorite_vocab_ids: progress.favorite_vocab_ids,
        mastered_grammar_ids: progress.mastered_grammar_ids,
      });
      if (!progressError) {
        createdCount += 1;
      }
    }

    const currentUsername = normalizeUsername(body.currentUsername ?? "");
    const response = NextResponse.json({ ok: true, createdCount });
    if (currentUsername) {
      const { data: existingCurrent } = await supabase
        .from("app_users")
        .select("id")
        .eq("username", currentUsername)
        .maybeSingle();
      if (existingCurrent) {
        setSessionCookie(response, currentUsername);
      }
    }
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, message: "迁移失败，请稍后重试" },
      { status: 500 },
    );
  }
}
