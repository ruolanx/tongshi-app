import { Answer, CompareResult, CompareDetail, Question, OptionKey } from "@/types";

export function calculateMatch(
  myAnswers: Answer[],
  theirAnswers: Answer[],
  questions: Question[]
): CompareResult {
  const myAnswerMap = new Map<number, OptionKey>();
  const theirAnswerMap = new Map<number, OptionKey>();

  for (const a of myAnswers) {
    myAnswerMap.set(a.question_id, a.selected_option);
  }
  for (const a of theirAnswers) {
    theirAnswerMap.set(a.question_id, a.selected_option);
  }

  const details: CompareDetail[] = [];
  let commonAnswered = 0;
  let matchingAnswers = 0;

  for (const q of questions) {
    const myAnswer = myAnswerMap.get(q.id) ?? null;
    const theirAnswer = theirAnswerMap.get(q.id) ?? null;
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

  return {
    totalQuestions: questions.length,
    commonAnswered,
    matchingAnswers,
    matchScore,
    details,
  };
}
