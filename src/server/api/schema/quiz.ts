import { object, string, array, boolean } from "zod";
import { type TypeOf } from "zod";

export const quizRequestSchema = object({

});

export const question = object({
  info: string(),
  synonyms: array(string()),
  choices: array(string()),
  answer: string(),
});

export const quizResponseSchema = object({
  questions: array(question),
});

export const submitAnswerSchema = object({
  word: string(),
  isAnswerCorrect: boolean(),
});

export type Question = TypeOf<typeof question>;
export type QuizRequest = TypeOf<typeof quizRequestSchema>;
export type QuizResponse = TypeOf<typeof quizResponseSchema>;

export type SubmitAnswerRequest = TypeOf<typeof submitAnswerSchema>;
