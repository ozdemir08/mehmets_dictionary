import { dictionaryRouter } from "~/server/api/routers/dictionary";
import { createTRPCRouter } from "~/server/api/trpc";
import { quizRouter } from "./routers/quiz";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dictionary: dictionaryRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
