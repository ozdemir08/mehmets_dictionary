import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import type { LookUpResponse } from "~/server/api/schema/dictionary";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [searchWordResult, setSearchWordResult] = useState<LookUpResponse>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = () => {
    setSearchWord(input);
  }

  api.dictionary.lookUp.useQuery({ word: searchWord },
    {
      onSuccess: (response) => {
        console.log(response);
        setSearchWordResult(response);
        setErrorMessage('');
      },
      onError: (e) => {
        setErrorMessage(e.message);
      },
      enabled: searchWord != ''
    }
  );

  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <div className="max-w-screen-lg flex flex-wrap items-center justify-center mx-auto p-4 space-x-6 border-b" >
          <Link href="/" className="text-2xl float-left">
            Mehmet&apos;s Dictionary
          </Link>

          <div className="float-right items-center">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-screen-lg top-align flex min-h-screen items-center flex-col justify-top-center mx-auto">
        <form className="border-solid border-2 border-gray-500 rounded-md my-6 justify-center items-center">

          <div className="flex flex-row">
            <input className="
                disabled appearance-none bg-transparent border-none w-full 
                text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text" placeholder="Enter a word" aria-label="Word"
              onChange={e => setInput(e.target.value)}
            />

            <button
              className="p-2 px-4 m-2 bg-neutral-400 hover:bg-neutral-600 rounded-md btn-primary"
              type="button"
              onClick={handleSubmit}>
              Search
            </button>
          </div>

        </form>


        <div className="container flex flex-col justify-top gap-6 px-8 py-6 disabled">
          <div>
            {errorMessage}
          </div>

          <div className="">
            {searchWordResult?.words.map(
              (word, index) => {
                return (
                  <div key={word.word + index} >
                    <div className="text-4xl text-gray-800 py-4" > {word.word} </div>

                    <div>
                      {word.meanings.map((meaning, index) => {
                        return (
                          <div key={meaning.partOfSpeech + index} className="py-4">
                            <div className="text-2xl text-gray-700 font-semi-bold" key={meaning.partOfSpeech}>{meaning.partOfSpeech}</div>
                            <div>
                              {
                                meaning.definitions.map((definition, index) => {
                                  return (
                                    <div key={definition.definition + index}>
                                      <div key={definition.definition + index} className="text-lg text-gray-600">
                                        - {definition.definition}
                                      </div>
                                      <div key={definition.example + index} className="text-base text-gray-500 italic">
                                        {definition.example}
                                      </div>
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
      </main >
    </>
  );
}
