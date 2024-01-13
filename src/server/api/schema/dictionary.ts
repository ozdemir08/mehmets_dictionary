import { object, string, array } from "zod";
import { type TypeOf } from "zod";

export const lookUpRequestSchema = object({
  word: string(),
});

export const phonetic = object({
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

export const word = object(
  {
    word: string(),
    phonetics: array(phonetic),
    meanings: array(meaning)
  }
);

export const lookUpResponseSchema = object({
  words: array(word),
}
);

export type LookUpRequest = TypeOf<typeof lookUpRequestSchema>;
export type LookUpResponse = TypeOf<typeof lookUpResponseSchema>;
