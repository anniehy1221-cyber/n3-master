## N3 Master

N3 学习应用（单词闪卡 + 语法词典），当前版本使用 Supabase 存储账号与学习进度。

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置环境变量（复制 `.env.example` 为 `.env.local`）

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
```

3. 初始化 Supabase 表结构（在 Supabase SQL Editor 执行）

- `supabase/schema.sql`

4. 启动开发服务（稳定模式）

```bash
npm run dev
```

打开 `http://127.0.0.1:3000`。

## 部署到 Vercel

- 在 Vercel 项目中配置与本地一致的环境变量：
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SESSION_SECRET`
- 推送到 GitHub 后自动触发部署。
