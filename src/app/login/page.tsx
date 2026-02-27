"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../../lib/userProgress";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    const result = loginUser(username, password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("登录成功，正在进入首页...");
    window.setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const handleRegister = () => {
    const result = registerUser(username, password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("注册成功，正在进入首页...");
    window.setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <main className="app-main flex min-h-full flex-col justify-center">
      <div className="rounded-full bg-[#f3f0ff] px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-[0.24em] text-[#6d56a3]">N3 MASTER</span>
          <span className="rounded-md bg-[#6d56a3] px-2 py-1 text-xs font-bold text-white">M3</span>
        </div>
      </div>

      <div className="space-y-2 pt-3">
        <h1 className="text-3xl font-bold text-[#1f2937]">登录学习账户</h1>
        <p className="text-sm text-slate-500">
          登录后可查看你自己的学习进度和收藏记录。
        </p>
      </div>

      <div className="mt-4 space-y-4 rounded-[2.5rem] border border-white bg-[#f8f7fc] p-1 shadow-sm">
        <div className="space-y-4 rounded-[2rem] bg-[#f3f0ff]/50 p-6">
          <input
            type="text"
            placeholder="账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-14 w-full rounded-2xl border-none bg-[#f0f2f8] px-5 text-base text-[#1f2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d56a3]/20"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 w-full rounded-2xl border-none bg-[#f0f2f8] px-5 text-base text-[#1f2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d56a3]/20"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleLogin}
          className="app-primary-btn h-12 w-full rounded-2xl px-6 text-base shadow-md shadow-[#6d56a3]/20"
        >
          登录
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#f3f0ff] px-6 text-base font-medium text-[#6d56a3] transition hover:bg-[#e5dfff]"
        >
          注册
        </button>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-xl px-3 py-2 text-xs ${
            message.includes("成功")
              ? "border border-[#d8f5df] bg-[#f1fff4] text-[#2a8f4a]"
              : "border border-[#ffe0e0] bg-[#fff0f0] text-[#e05252]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </main>
  );
}

