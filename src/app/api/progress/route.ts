import { NextRequest, NextResponse } from "next/server";
import { sanitizeProgressInput } from "@/lib/auth";
import { emptyProgress } from "@/lib/progress";
import { getSessionUsername } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

async function resolveUserId(username: string): Promise<string | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (error || !data) return null;
  return data.id as string;
}

export async function GET(request: NextRequest) {
  const username = getSessionUsername(request);
  if (!username) {
    return NextResponse.json(
      { ok: false, message: "未登录" },
      { status: 401 },
    );
  }

  const userId = await resolveUserId(username);
  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "用户不存在" },
      { status: 404 },
    );
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("mastered_vocab_ids,favorite_vocab_ids,mastered_grammar_ids")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    return NextResponse.json(
      { ok: false, message: "读取进度失败" },
      { status: 500 },
    );
  }

  const progress = sanitizeProgressInput(data ?? emptyProgress());
  if (!data) {
    await supabase.from("user_progress").upsert({
      user_id: userId,
      mastered_vocab_ids: progress.mastered_vocab_ids,
      favorite_vocab_ids: progress.favorite_vocab_ids,
      mastered_grammar_ids: progress.mastered_grammar_ids,
    });
  }
  return NextResponse.json({ ok: true, progress });
}

export async function PATCH(request: NextRequest) {
  const username = getSessionUsername(request);
  if (!username) {
    return NextResponse.json(
      { ok: false, message: "未登录" },
      { status: 401 },
    );
  }
  const userId = await resolveUserId(username);
  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "用户不存在" },
      { status: 404 },
    );
  }

  const body = (await request.json()) as {
    progress?: unknown;
  };
  const progress = sanitizeProgressInput(body.progress);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    mastered_vocab_ids: progress.mastered_vocab_ids,
    favorite_vocab_ids: progress.favorite_vocab_ids,
    mastered_grammar_ids: progress.mastered_grammar_ids,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    return NextResponse.json(
      { ok: false, message: "更新进度失败" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, progress });
}
