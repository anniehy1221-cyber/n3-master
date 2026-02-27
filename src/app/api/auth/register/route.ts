import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { normalizePassword, normalizeUsername } from "@/lib/auth";
import { emptyProgress } from "@/lib/progress";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const username = normalizeUsername(body.username ?? "");
    const password = normalizePassword(body.password ?? "");
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "账号和密码不能为空" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const { data: existing, error: existingError } = await supabase
      .from("app_users")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (existingError) {
      console.error("[auth/register] existing lookup error", existingError);
      return NextResponse.json(
        { ok: false, message: "注册失败，请稍后重试" },
        { status: 500 },
      );
    }
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "账号已存在，请直接登录" },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 10);
    const { data: insertedUser, error: userInsertError } = await supabase
      .from("app_users")
      .insert({
        username,
        password_hash: passwordHash,
      })
      .select("id,username")
      .single();
    if (userInsertError || !insertedUser) {
      console.error("[auth/register] user insert error", userInsertError);
      return NextResponse.json(
        { ok: false, message: "注册失败，请稍后重试" },
        { status: 500 },
      );
    }

    const empty = emptyProgress();
    const { error: progressError } = await supabase.from("user_progress").upsert({
      user_id: insertedUser.id,
      mastered_vocab_ids: empty.mastered_vocab_ids,
      favorite_vocab_ids: empty.favorite_vocab_ids,
      mastered_grammar_ids: empty.mastered_grammar_ids,
    });
    if (progressError) {
      console.error("[auth/register] progress upsert error", progressError);
      return NextResponse.json(
        { ok: false, message: "注册失败，请稍后重试" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ ok: true, message: "注册成功" });
    setSessionCookie(response, insertedUser.username);
    return response;
  } catch (error) {
    console.error("[auth/register] unexpected error", error);
    return NextResponse.json(
      { ok: false, message: "注册失败，请稍后重试" },
      { status: 500 },
    );
  }
}
