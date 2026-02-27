import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { normalizePassword, normalizeUsername } from "@/lib/auth";
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
    const { data: user, error } = await supabase
      .from("app_users")
      .select("username,password_hash")
      .eq("username", username)
      .maybeSingle();
    if (error) {
      console.error("[auth/login] user lookup error", error);
      return NextResponse.json(
        { ok: false, message: "登录失败，请稍后重试" },
        { status: 500 },
      );
    }
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "账号不存在，请先注册" },
        { status: 404 },
      );
    }

    const matched = await compare(password, user.password_hash);
    if (!matched) {
      return NextResponse.json(
        { ok: false, message: "账号或密码错误" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true, message: "登录成功" });
    setSessionCookie(response, user.username);
    return response;
  } catch (error) {
    console.error("[auth/login] unexpected error", error);
    return NextResponse.json(
      { ok: false, message: "登录失败，请稍后重试" },
      { status: 500 },
    );
  }
}
