import { object, string, array, number } from "zod";
import { type TypeOf } from "zod";

export const lookUpRequestSchema = object({
  word: string(),
});

export const phonetic = object({
  text: string(),
  audio: string(),
  sourceUrl: string(),
});

export const definition = object({
  definition: string(),
  example: string(),
  synonyms: array(string()),
  antonyms: array(string()),
});

export const meaning = object({
  partOfSpeech: string(),
  definitions: array(definition),
  synonyms: array(string()),
  antonyms: array(string()),
});

export const word = object({
  word: string(),
  phonetics: array(phonetic),
  meanings: array(meaning)
});

export const words = array(word);

export const lookUpResponseSchema = object({
  words: words,
});

export const getHistoryRequestSchema = object({});
export const getHistoryResponseSchema = array(object({
  word: string(),
  lookUpCount: number()
}));

export type LookUpResponseWords = TypeOf<typeof words>;
export type LookUpRequest = TypeOf<typeof lookUpRequestSchema>;
export type LookUpResponse = TypeOf<typeof lookUpResponseSchema>;

export type HistoryRequest = TypeOf<typeof getHistoryRequestSchema>;
export type HistoryResponse = TypeOf<typeof getHistoryResponseSchema>;
