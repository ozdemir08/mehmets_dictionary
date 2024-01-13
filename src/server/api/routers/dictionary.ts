import {
  type Context,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { LookUpRequest, LookUpResponse, LookUpResponseWords } from "../schema/dictionary";
import { lookUpRequestSchema } from "../schema/dictionary";

export const dictionaryRouter = createTRPCRouter({
  lookUp: publicProcedure.input(lookUpRequestSchema).query(lookUp),
});

async function lookUp({ ctx, input }: { ctx: Context, input: LookUpRequest }): Promise<LookUpResponse> {
  const lookUpUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + input.word;

  const lookupResponsePromise = await fetch(lookUpUrl);
  const actualResponse : LookUpResponseWords = await lookupResponsePromise.json() as LookUpResponseWords;
  
  await increaseLookupCounter({ctx: ctx, word: input.word});

  return {
    words: actualResponse
  } as LookUpResponse;
}

async function increaseLookupCounter({ ctx, word }: { ctx: Context, word: string}) {
  console.log("Looking up "+ word); 
  const userId = getUserIdFromContext(ctx);
  const wordInDb = await ctx.db.word.findFirst({
    where: {
      userId: userId,
      word: word
    }
  }); 

  if (wordInDb == null) {
    console.log("Adding " + word + "to db");
    await ctx.db.word.create({data: {
      userId: userId,
      word: word,
      lookUpCount: 1
    }});
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

function getUserIdFromContext(ctx: Context): string {
  const userId = ctx.auth.userId;

  if (userId == null) {
      throw new Error('User is not signed in!!!! FUCK FUCK FUCK.')
  }

  return userId;
}
