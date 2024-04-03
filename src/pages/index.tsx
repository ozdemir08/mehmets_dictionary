import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationBar from "./components/navigation_bar";
import DefinitionView from "./components/definition_view";
import { useState } from "react";
import DefinitionView2 from "./components/definition_view_v2";

export default function Home() {
  const word = useSearchParams().get("word");

  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/?word=" + input.toLowerCase());
  };

  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />

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

        {word != null && <DefinitionView word={word} />}
      </main>
    </>
  );
}
