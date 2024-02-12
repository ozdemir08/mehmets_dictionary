import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";
import History from "./history";

export default function Home() {
  const word = useSearchParams().get("word");

  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/?word=" + input.toLowerCase());
  };

  const playAudio = async (audio: string) => {
    if (audio == "") {
      return;
    }

    await new Audio(audio).play();
  };

  const lookUpResult = api.dictionary.lookUp.useQuery(
    { word: word! },
    {
      enabled: word != null,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <div className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between space-x-6 bg-gray-50 p-8">
          <Link href="/" className="text-xl">
            Mehmet&apos;s Dictionary
          </Link>

          <Link href="/quiz" className="text-xl">
            Quiz
          </Link>

          <div className="items-center justify-self-end">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="top-align justify-top-center mx-auto flex max-w-screen-lg flex-col items-center bg-gray-50 px-4">
        <form className="m-4 flex w-full flex-row justify-end rounded-md border-2 border-gray-500 sm:w-auto">
          <input
            className="
                mr-3
                w-full border-none px-2 py-1 leading-tight text-gray-700"
            type="text"
            placeholder="Enter a word"
            aria-label="Word"
            autoFocus
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            className="btn-primary m-2 rounded-md bg-neutral-400 px-4 py-2 hover:bg-neutral-600"
            type="button"
            onClick={handleSubmit}
          >
            Search
          </button>
        </form>

        <div className="justify-top disabled container mx-2 flex flex-col">
          <div>{lookUpResult.error?.message}</div>

          <div>
            {lookUpResult.data?.words.map((word, index) => {
              return (
                <div key={word.word + index}>
                  <div className="py-4 text-4xl text-gray-800">
                    {" "}
                    {word.word}{" "}
                  </div>
                  <div className="mt-2 flex flex-row">
                    {word.phonetics.map((phonetic, index) => (
                      <div
                        key={phonetic.text + index}
                        className="mr-2 pe-2 text-gray-700"
                        onClick={() => playAudio(phonetic.audio)}
                      >
                        {phonetic.text}
                      </div>
                    ))}
                  </div>
                  <div>
                    {word.meanings.map((meaning, index) => {
                      return (
                        <div
                          key={meaning.partOfSpeech + index}
                          className="py-4"
                        >
                          <div
                            className="font-semi-bold text-2xl text-gray-700"
                            key={meaning.partOfSpeech}
                          >
                            {meaning.partOfSpeech}
                          </div>
                          <div>
                            {meaning.definitions.map((definition, index) => {
                              return (
                                <div
                                  key={definition.definition + index}
                                  className="my-2"
                                >
                                  <div
                                    key={definition.definition + index}
                                    className="text-lg"
                                  >
                                    - {definition.definition}
                                  </div>
                                  <div
                                    key={definition.example + index}
                                    className="text-base italic text-gray-700"
                                  >
                                    {definition.example}
                                  </div>
                                  {definition.antonyms ? (
                                    <div className="mt-2 flex flex-row">
                                      {definition.antonyms.map((antonym) => (
                                        <a
                                          key={antonym}
                                          href={`/?word=${antonym}`}
                                          className="mr-2 rounded-md bg-red-200 px-2"
                                        >
                                          {antonym}
                                        </a>
                                      ))}
                                    </div>
                                  ) : null}
                                  {definition.synonyms ? (
                                    <div className="mt-2 flex flex-row">
                                      {definition.synonyms.map((synonym) => (
                                        <a
                                          key={synonym}
                                          href={`/?word=${synonym}`}
                                          className="mr-2 rounded-md bg-green-200 px-2"
                                        >
                                          {synonym}
                                        </a>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="m-2 w-full">
          {lookUpResult.isFetching ? null : <History />}
        </div>
      </main>
    </>
  );
}
