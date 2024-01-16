import {
  type Context,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { HistoryRequest, HistoryResponse, LookUpRequest, LookUpResponse, LookUpResponseWords } from "../schema/dictionary";
import { getHistoryRequestSchema, lookUpRequestSchema } from "../schema/dictionary";
import { TRPCError } from "@trpc/server";

export const dictionaryRouter = createTRPCRouter({
  lookUp: publicProcedure.input(lookUpRequestSchema).query(lookUp),
  getHistory: publicProcedure.input(getHistoryRequestSchema).query(getHistory),
});

async function lookUp({ ctx, input }: { ctx: Context, input: LookUpRequest }): Promise<LookUpResponse> {
  const lookUpUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + input.word;

  const lookupResponse = await fetch(lookUpUrl);

  const actualResponse: LookUpResponseWords = await lookupResponse.json() as LookUpResponseWords;

  if (actualResponse.length == undefined) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: input.word + ' is not found.'
    });
  }

  await increaseLookupCounter({ ctx: ctx, word: input.word });

  return {
    words: actualResponse
  } as LookUpResponse;
}

async function increaseLookupCounter({ ctx, word }: { ctx: Context, word: string }) {
  const userId = getUserIdFromContext(ctx);
  const wordInDb = await ctx.db.word.findFirst({
    where: {
      userId: userId,
      word: word
    }
  });

  if (wordInDb == null) {
    console.log("Adding " + word + "to db");
    await ctx.db.word.create({
      data: {
        userId: userId,
        word: word,
        lookUpCount: 1
      }
    });
  } else {
    await ctx.db.word.update({
      where: {
        id: wordInDb.id,
      },
      data: {
        lookUpCount: wordInDb.lookUpCount + 1
      }
    });
  }
}

async function getHistory({ ctx, input }: { ctx: Context, input: HistoryRequest }): Promise<HistoryResponse> {
  const userId = getUserIdFromContext(ctx);

  const history = await ctx.db.word.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      lookUpCount: 'desc',
    }
  });

  console.log(history);
  return history as HistoryResponse;
}

function getUserIdFromContext(ctx: Context): string {
  const userId = ctx.auth.userId;

  if (userId == null) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User is not signed in!!!! FUCK FUCK FUCK.'
    });
  }

  return userId;
}
