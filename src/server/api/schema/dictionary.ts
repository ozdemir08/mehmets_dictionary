import { object, string, array, number } from "zod";
import { type TypeOf } from "zod";

export const lookUpRequestSchema = object({
  word: string(),
});

export const phoneticSchema = object({
  text: string(),
  audio: string(),
  sourceUrl: string(),
});

export const definitionSchema = object({
  definition: string(),
  example: string(),
  synonyms: array(string()),
  antonyms: array(string()),
});

export const meaningSchema = object({
  partOfSpeech: string(),
  definitions: array(definitionSchema),
  synonyms: array(string()),
  antonyms: array(string()),
});

export const wordSchema = object({
  word: string(),
  phonetics: array(phoneticSchema),
  meanings: array(meaningSchema),
  mnemonics: string(),
  etymology: string(),
  funFact: string(),
});

export const wordsSchema = array(wordSchema);

export const lookUpResponseSchema = object({
  words: wordsSchema,
});

export const getHistoryRequestSchema = object({});
export const getHistoryResponseSchema = array(object({
  word: string(),
  lookUpCount: number()
}));

export type LookUpResponseWords = TypeOf<typeof wordsSchema>;
export type LookUpRequest = TypeOf<typeof lookUpRequestSchema>;
export type LookUpResponse = TypeOf<typeof lookUpResponseSchema>;

export type HistoryRequest = TypeOf<typeof getHistoryRequestSchema>;
export type HistoryResponse = TypeOf<typeof getHistoryResponseSchema>;
