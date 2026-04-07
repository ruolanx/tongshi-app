# Tongshi — 我们适合做同事吗？

一个轻量级 MVP，让用户通过 10 个工作场景问题比较工作风格匹配度。

## Tech Stack

- **Next.js** (App Router + TypeScript)
- **Tailwind CSS**
- **Supabase** (Database + Auth-less)

## Getting Started

### 1. 创建 Supabase 项目

前往 [supabase.com](https://supabase.com) 创建一个新项目。

### 2. 运行数据库 Schema

在 Supabase Dashboard → SQL Editor 中执行 `supabase/schema.sql` 文件的内容。
这会创建 `users`、`questions`、`answers` 三张表，并填充 10 道占位题目。

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

填入你的 Supabase 项目 URL 和 anon key：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 安装 & 启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 项目结构

```
tongshi-app/
├── app/
│   ├── page.tsx              # 加入页面（输入代号）
│   ├── questions/page.tsx    # 答题页面
│   ├── dashboard/page.tsx    # 仪表盘（用户列表）
│   └── compare/[userId]/     # 对比页面
├── components/               # UI 组件
├── lib/
│   ├── supabase.ts           # Supabase 客户端
│   ├── match.ts              # 匹配分数计算
│   ├── user-context.tsx      # 用户会话管理
│   └── utils.ts              # 工具函数
├── types/                    # TypeScript 类型
├── seed/                     # 题目种子数据
└── supabase/
    └── schema.sql            # 数据库 Schema + 种子数据
```

## 功能

- **代号加入** — 无需注册，选个代号即可
- **10 题场景问答** — 逐题回答，自动保存
- **用户仪表盘** — 查看所有用户和在线状态
- **匹配对比** — 与其他用户逐题对比 + 匹配分数
- **在线状态** — 基于心跳的轻量在线检测

## 匹配算法

```
match_score = (相同答案数 / 共同已答题数) × 100
```

- 80–100%: Strong match
- 55–79%: Mixed but workable
- 0–54%: Friction likely
