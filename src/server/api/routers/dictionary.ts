import { z } from "zod";

import {
  type Context,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { LookUpRequest, LookUpResponse } from "../schema/dictionary";
import { lookUpRequestSchema, lookUpResponseSchema } from "../schema/dictionary";

export const dictionaryRouter = createTRPCRouter({
  lookUp: publicProcedure.input(lookUpRequestSchema).query(lookUp),
});

async function lookUp({ input }: { input: LookUpRequest }): Promise<LookUpResponse> {

  const lookUpUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + input.word;
  console.log(lookUpUrl);
  let lookupResponsePromise = await fetch(lookUpUrl);
  const actualResponse = await lookupResponsePromise.json();
  console.log(actualResponse);
  let response =
    [
      {
        "word": "alter ego",
        "phonetics": [
          {
            "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/alter%20ego-us.mp3",
            "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=892565",
            "license": {
              "name": "BY-SA 3.0",
              "url": "https://creativecommons.org/licenses/by-sa/3.0"
            }
          }
        ],
        "meanings": [
          {
            "partOfSpeech": "noun",
            "definitions": [
              {
                "definition": "Somebody's alternate personality or persona; another self.",
                "synonyms": [],
                "antonyms": []
              },
              {
                "definition": "A very close and intimate friend.",
                "synonyms": [],
                "antonyms": []
              },
              {
                "definition": "A corporation used by a person to conduct personal business in an attempt to shield himself or herself from personal liability, and which a court may penetrate by \"piercing the corporate veil\" to impose liability on the person when they commit fraud or injustice.",
                "synonyms": [],
                "antonyms": []
              }
            ],
            "synonyms": [
              "alter idem"
            ],
            "antonyms": []
          }
        ],
        "license": {
          "name": "CC BY-SA 3.0",
          "url": "https://creativecommons.org/licenses/by-sa/3.0"
        },
        "sourceUrls": [
          "https://en.wiktionary.org/wiki/alter%20ego"
        ]
      }
    ];

  return {
    words: actualResponse
  };
}
