import {
  type Context,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type {
  QuizRequest,
  QuizResponse,
  SubmitAnswerRequest,
} from "../schema/quiz";

import { quizRequestSchema, submitAnswerSchema } from "../schema/quiz";
import {
  submitAnswer as persistAnswer,
  getNextWordsForQuiz,
} from "~/server/persistence/quiz_persistence_service";
import { type Word } from "@prisma/client";

export const quizRouter = createTRPCRouter({
  getQuiz: publicProcedure.input(quizRequestSchema).query(getQuiz),
  submitAnswer: publicProcedure
    .input(submitAnswerSchema)
    .mutation(submitAnswer),
});

async function getQuiz({
  ctx,
  input,
}: {
  ctx: Context;
  input: QuizRequest;
}): Promise<QuizResponse> {
  const words = await getNextWordsForQuiz(ctx, 150);

  // D-D-D-W-M-Y
  // 1. Eliminate words that should not be shown.
  const wordsThatCanBeShown = words.filter((word) => {
    if (word.correctAnswerStreak == 0) {
      return true;
    }

    const now = new Date();
    if (word.correctAnswerStreak < 3) {
      // Can be shown if last answer is given more than a day ago.
      return now > addDays(word.lastAnswerSubmittedAt, 1);
    }

    if (word.correctAnswerStreak == 4) {
      // Can be shown if last answer is given more than a week ago.
      return now > addDays(word.lastAnswerSubmittedAt, 7);
    }

    if (word.correctAnswerStreak == 5) {
      // Can be shown if last answer is given more than a month ago.
      return now > addDays(word.lastAnswerSubmittedAt, 30);
    }

    if (word.correctAnswerStreak == 6) {
      // Can be shown if last answer is given more than a quarter ago.
      return now > addDays(word.lastAnswerSubmittedAt, 90);
    }

    if (word.correctAnswerStreak > 6) {
      // Can be shown if last answer is given more than a year ago.
      return now > addDays(word.lastAnswerSubmittedAt, 365);
    }
  });

  // 2. Sort them based on criteria below: 1. Higher lookup count.
  wordsThatCanBeShown.sort((a, b) => {
    if (a.lookUpCount != b.lookUpCount) {
      return b.lookUpCount - a.lookUpCount;
    }

    if (b.lastAnswerSubmittedAt && a.lastAnswerSubmittedAt) {
      return (
        b.lastAnswerSubmittedAt?.getUTCSeconds() -
        a.lastAnswerSubmittedAt?.getUTCSeconds()
      );
    }

    return b.lastAnswerSubmittedAt ? 1 : -1;
  });

  // 3. Select a subset of them.
  const wordsToShow = wordsThatCanBeShown.slice(0, 20);

  const wordsToShowWithThesaurus = await Promise.all(
    wordsToShow.map(async (word) => await getThesaurusResult(word)),
  );

  const finalResults = {
    questions: wordsToShowWithThesaurus
      .map((element) => thesaurusResultToQuizResponse(element, words))
      .filter((element) => element.synonyms.length > 0),
  } as QuizResponse;

  return finalResults;
}

function addDays(date: Date | null, days: number): Date {
  if (date == null) {
    return new Date();
  }

  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

async function submitAnswer({
  ctx,
  input,
}: {
  ctx: Context;
  input: SubmitAnswerRequest;
}): Promise<void> {
  await persistAnswer(ctx, input);
}

function thesaurusResultToQuizResponse(
  thesaurusResult: ThesaurusResult,
  allWords: Array<Word>,
): {
  info: string;
  synonyms: Array<string>;
  choices: Array<string>;
  answer: string;
} {
  const choices = allWords
    .map((word) => word.word)
    .filter((element) => element != thesaurusResult.word.word)
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .slice(0, 4);
  choices.push(thesaurusResult.word.word);

  return {
    info: getInfo(thesaurusResult.word),
    synonyms: thesaurusResult.synonyms.slice(0, 5),
    choices: choices.sort(),
    answer: thesaurusResult.word.word,
  };
}

function getInfo(word: Word): string {
  if (word.correctAnswerStreak == 0 && word.lastAnswerSubmittedAt == null) {
    return "You are seeing this question for the first time";
  }

  if (word.correctAnswerStreak == 0) {
    return "You have not answered this question correctly before.";
  }

  if (word.correctAnswerStreak > 0 && word.lookUpCount <= 3) {
    return "You have answered this question correctly before.";
  }

  return "You are mastering this!";
}

async function getThesaurusResult(word: Word): Promise<ThesaurusResult> {
  const result = await fetch(
    "https://api.api-ninjas.com/v1/thesaurus?word=" + word.word,
    {
      headers: {
        "X-Api-Key": "Qp2emj7Al9A6gUBY2Q1yJA==Z0iTnzbh2VIv0jaa",
      },
    },
  );

  // Ugly, but I need to replace the word with a Word object.
  const resultAsJson = (await result.json()) as ThesaurusResult;

  resultAsJson.word = word;

  return resultAsJson;
}

interface ThesaurusResult {
  word: Word;
  synonyms: Array<string>;
  antonyms: Array<string>;
}
