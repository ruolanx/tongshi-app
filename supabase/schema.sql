-- Tongshi MVP Database Schema
-- Run this in your Supabase SQL editor to set up the tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codename TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  order_index INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);

-- Enable Row Level Security (but allow all for MVP)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Permissive policies for MVP (no auth)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for questions" ON questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for answers" ON answers FOR ALL USING (true) WITH CHECK (true);

-- Seed 10 placeholder questions
INSERT INTO questions (order_index, prompt, option_a, option_b, option_c, option_d) VALUES
(1, 'PM 在上线前一天改了需求范围，你通常会…', '直接做，别废话', '先问清楚原因，再决定', '直接 push back', '表面答应，内心翻白眼'),
(2, '同事没赶上 deadline，你的第一反应是…', '帮忙补位，大家都不容易', '问一下原因，看看能不能一起解决', '向上汇报，这不是我的锅', '下次提前预警，避免再发生'),
(3, '团队要约一个全员会议，你更倾向…', '越短越好，15分钟搞定', '有明确 agenda 就行', '不需要开会，Slack 说清楚就好', '开久一点没关系，把事情讨论透'),
(4, 'Code review 时有人对你的方案提出不同意见，你会…', '认真听，有道理就改', '解释我的思路，争取说服对方', '直接按他说的改，省事', '拉个小会讨论，避免文字误解'),
(5, '你理想的 Slack/消息沟通方式是…', '能一条消息说清楚就别分三条发', '随时发，想到什么说什么', '非紧急的事情统一时间回复', '重要的事情还是打电话或面聊'),
(6, '关于周末和加班，你的态度是…', '活干完就好，不在意时间', '偶尔可以，但别成为常态', '工作时间内解决，周末是我的', '看项目阶段，关键节点可以拼一下'),
(7, '做重要决策时，你更偏向…', '快速拍板，边做边调', '收集足够信息后再做决定', '跟团队讨论达成共识', '让最有经验的人来决定'),
(8, '收到批评性反馈后，你通常会…', '先消化情绪，再理性分析', '当场讨论，搞清楚具体问题', '默默记住，用行动证明自己', '反思是否合理，不合理会反驳'),
(9, '团队内部有人起冲突，你会…', '主动调解，团队和谐最重要', '不掺和，让他们自己解决', '找 leader 介入处理', '私下分别聊聊，了解情况'),
(10, '接手一个全新项目，你第一步通常是…', '先看现有代码和文档', '找相关的人聊聊背景', '直接开干，边做边了解', '先列计划，搞清楚目标和边界')
ON CONFLICT DO NOTHING;
