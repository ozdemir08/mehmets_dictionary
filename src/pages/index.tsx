import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from "react";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";
import History from "./history";

export default function Home() {
  const word = useSearchParams().get('word');

  const [input, setInput] = useState<string>('');
  const router = useRouter()

  const handleSubmit = () => {
    router.push('/?word=' + input.toLowerCase());
  };

  const playAudio = async (audio: string) => {
    if (audio == '') {
      return;
    }

    await new Audio(audio).play();
  };

  const lookUpResult = api.dictionary.lookUp.useQuery({ word: word! }, {
    enabled: word != null, retryOnMount: false,
    refetchOnWindowFocus: false
  });

  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <div className="max-w-screen-lg flex flex-wrap justify-between items-center mx-auto p-8 space-x-6 border-b bg-red-400" >
          <Link href="/" className="text-xl">
            Mehmet&apos;s Dictionary
          </Link>

          <Link href="/quiz" className="text-xl">
            Quiz
          </Link>

          <div className="justify-self-end float-right items-center">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-screen-lg top-align flex flex-col items-center justify-top-center bg-gray-50 mx-auto px-4">

        <form className="flex flex-row w-full sm:w-auto border-2 border-gray-500 rounded-md m-4 justify-end">
          <input className="
                border-none  
                text-gray-700 mr-3 py-1 px-2 leading-tight w-full"
            type="text" placeholder="Enter a word" aria-label="Word"
            autoFocus onChange={e => setInput(e.target.value)}
          />

          <button
            className="px-4 py-2 m-2 bg-neutral-400 hover:bg-neutral-600 rounded-md btn-primary"
            type="button"
            onClick={handleSubmit}>
            Search
          </button>

        </form>

        <div className="container flex flex-col justify-top mx-2 disabled">

          <div>
            {lookUpResult.error?.message}
          </div>

          <div>
            {lookUpResult.data?.words.map(
              (word, index) => {
                return (
                  <div key={word.word + index} >
                    <div className="text-4xl text-gray-800 py-4" > {word.word} </div>
                    <div className="flex flex-row mt-2" >
                      {word.phonetics.map((phonetic, index) =>
                        <div key={phonetic.text + index} className="mr-2 pe-2 text-gray-700" onClick={() => playAudio(phonetic.audio)}>
                          {phonetic.text}
                        </div>)}
                    </div>
                    <div>
                      {word.meanings.map((meaning, index) => {
                        return (
                          <div key={meaning.partOfSpeech + index} className="py-4">
                            <div className="text-2xl text-gray-700 font-semi-bold" key={meaning.partOfSpeech}>{meaning.partOfSpeech}</div>
                            <div>
                              {
                                meaning.definitions.map((definition, index) => {
                                  return (
                                    <div key={definition.definition + index} className="my-2">
                                      <div key={definition.definition + index} className="text-lg">
                                        - {definition.definition}
                                      </div>
                                      <div key={definition.example + index} className="text-base text-gray-700 italic">
                                        {definition.example}
                                      </div>
                                      {definition.antonyms ?
                                        <div className="flex flex-row mt-2">
                                          {definition.antonyms.map(antonym =>
                                            <a key={antonym} href={`/?word=${antonym}`} className="mr-2 px-2 bg-red-200 rounded-md">{antonym}</a>
                                          )}
                                        </div>
                                        :
                                        null
                                      }
                                      {definition.synonyms ?
                                        <div className="flex flex-row mt-2">
                                          {definition.synonyms.map(synonym =>
                                            <a key={synonym} href={`/?word=${synonym}`} className="mr-2 px-2 bg-green-200 rounded-md">{synonym}</a>
                                          )}
                                        </div>
                                        : null}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }
            )}
          </div>

        </div>

        <div className="w-full m-2">
          {
            lookUpResult.isFetching ? null : <History />
          }
        </div>
      </main >
    </>
  );
}
