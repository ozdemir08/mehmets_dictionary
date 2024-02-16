import Head from "next/head";
import NavigationBar from "../components/navigation_bar";
import History from "../components/history";

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />

      <main className="top-align justify-top-center mx-auto mt-5 flex max-w-screen-lg flex-col">
        <History />
      </main>
    </>
  );
}
