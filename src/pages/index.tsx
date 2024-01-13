import Head from "next/head";
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

  // Could not find the right type. 
  // const handleEnterOnInput = (event: KeyboardEvent) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     handleSubmit();
  //   }
  // }

  api.dictionary.lookUp.useQuery({ word: searchWord },
    {
      onSuccess: (response) => {
        // Update the data here after fetch/re-fetch
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
      <main className="top-align flex min-h-screen flex-col items-center justify-top py-8">

        <div className="w-full flex flex-row justify-center items-center">
          <h3 className="text-5xl">
            Mehmet&apos;s Dictionary
          </h3>

          <div className="flex justify-end justify-self-end">
            <UserButton />
          </div>
        </div>

        <div className="container flex flex-col items-center justify-top gap-6 px-4 py-8 disabled">
          <form className="w-full max-w-sm border-solid border-2 border-gray-500 rounded-md">
            <div className="flex justify-content-top items-center">
              <input className="disabled appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter a word" aria-label="Word"
                onChange={e => setInput(e.target.value)}
              />
              <button
                className="px-4 mx-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                type="button"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </form>

          <div>
            {errorMessage}
          </div>

          <div className="">
            {searchWordResult?.words.map(
              (word, index) => {
                return (
                  <div key={word.word + index} >
                    <div className="text-4xl text-gray-800" > {word.word} </div>
                    <br />
                    <div>
                      {word.meanings.map((meaning, index) => {
                        return (
                          <div key={meaning.partOfSpeech + index}>
                            <div className="text-2xl text-gray-700 font-semi-bold" key={meaning.partOfSpeech}>{meaning.partOfSpeech}</div>
                            <div>
                              {
                                meaning.definitions.map((definition, index) => {
                                  return (
                                    <>
                                      <div key={definition.definition + index} className="text-lg text-gray-600">
                                        - {definition.definition}
                                      </div>
                                      <div key={definition.example + index} className="text-base text-gray-500">
                                        <i>
                                          {definition.example}
                                        </i>
                                      </div>
                                      <br />
                                    </>
                                  )
                                })
                              }
                            </div>
                            <br />
                          </div>
                        )
                      })}
                      <br />

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
