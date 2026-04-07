# Tongshi — 我们适合做同事吗？

双人互动小游戏：两个人通过一个链接进入同一个房间，各自回答 10 个工作场景问题，最后看匹配结果。

## 玩法

1. 创建房间 → 获得一个链接
2. 把链接发给朋友
3. 两人各自起代号加入
4. 同时回答 10 道题（能实时看到对方进度）
5. 两人都答完 → 揭晓匹配分数 + 逐题对比
6. 分享结果到社交媒体

## Tech Stack

- **Next.js 16** (App Router + TypeScript)
- **Tailwind CSS**
- **Supabase** (Database, no auth)

## Getting Started

### 1. Supabase 设置

前往 [supabase.com](https://supabase.com) 创建项目，在 SQL Editor 中执行 `supabase/schema.sql`。

### 2. 环境变量

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
app/
  page.tsx                # 首页 — 创建房间
  s/[code]/page.tsx       # 房间页 — 加入/等待/答题/结果
components/
  join-form.tsx           # 输入代号
  waiting-room.tsx        # 等待对方
  question-flow.tsx       # 答题（双方进度）
  match-results.tsx       # 匹配结果
  share-buttons.tsx       # 社交分享
  avatar.tsx              # 头像
lib/
  supabase.ts             # Supabase 客户端
  session.ts              # 房间/玩家 DB 操作
  match.ts                # 匹配算法
  utils.ts                # 工具函数
types/index.ts            # TypeScript 类型
supabase/schema.sql       # 建表 + 种子数据
```

## 匹配算法

```
match_score = (相同答案数 / 共同已答题数) × 100
```

| 分数 | 标签 |
|------|------|
| 80–100% | 🔥 默契搭档 |
| 55–79% | 🤝 磨合空间 |
| 0–54% | ⚡ 火花四溅 |
