import { TRPCError } from "@trpc/server";
import { type SubmitAnswerRequest } from "../api/schema/quiz";
import { type Context } from "../api/trpc";

export async function getNextWordsForQuiz(
  context: Context,
  wordCountWanted: number,
): Promise<WordType[]> {
  return await context.db.word.findMany({
    where: {
      userId: getUserIdFromContext(context),
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: wordCountWanted,
  });
}

export async function getWord(
  context: Context,
  wordToLookup: string,
): Promise<WordType> {
  const word = await context.db.word.findFirst({
    where: {
      userId: getUserIdFromContext(context),
      word: wordToLookup,
    },
  });

  if (word == null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Word is not expected to be null",
    });
  }

  return word;
}

export async function submitAnswer(
  context: Context,
  request: SubmitAnswerRequest,
): Promise<void> {
  const word = await getWord(context, request.word);
  await context.db.word.update({
    where: {
      id: word.id,
      userId: getUserIdFromContext(context),
    },
    data: {
      correctAnswerStreak: Math.max(
        0,
        word.correctAnswerStreak + (request.isAnswerCorrect ? 1 : -1),
      ),
      lastAnswerSubmittedAt: new Date(),
    },
  });
}

function getUserIdFromContext(ctx: Context): string {
  const userId = ctx.auth.userId;

  if (userId == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not signed in!!!!",
    });
  }

  return userId;
}

interface WordType {
  id: string;
  userId: string;
  word: string;
  lookUpCount: number;
  correctAnswerStreak: number;
  lastAnswerSubmittedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
