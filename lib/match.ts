import { Answer, MatchResult, MatchDetail, Question, OptionKey } from "@/types";

export function calculateMatch(
  myAnswers: Answer[],
  theirAnswers: Answer[],
  questions: Question[]
): MatchResult {
  const myMap = new Map<number, OptionKey>();
  const theirMap = new Map<number, OptionKey>();

  for (const a of myAnswers) myMap.set(a.question_id, a.selected_option);
  for (const a of theirAnswers) theirMap.set(a.question_id, a.selected_option);

  const details: MatchDetail[] = [];
  let commonAnswered = 0;
  let matchingAnswers = 0;

  for (const q of questions) {
    const myAnswer = myMap.get(q.id) ?? null;
    const theirAnswer = theirMap.get(q.id) ?? null;
    const bothAnswered = myAnswer !== null && theirAnswer !== null;
    const isMatch = bothAnswered && myAnswer === theirAnswer;

    if (bothAnswered) {
      commonAnswered++;
      if (isMatch) matchingAnswers++;
    }

    details.push({ question: q, myAnswer, theirAnswer, isMatch });
  }

  const matchScore =
    commonAnswered > 0
      ? Math.round((matchingAnswers / commonAnswered) * 100)
      : 0;

  return { totalQuestions: questions.length, commonAnswered, matchingAnswers, matchScore, details };
}
