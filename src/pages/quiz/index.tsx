import Head from "next/head";
import { api } from "~/utils/api";
import { useState } from "react";
import { type QuizResponse } from "~/server/api/schema/quiz";
import { type Question } from "~/server/api/schema/quiz";
import NavigationBar from "../components/navigation_bar";

export default function Quiz() {
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  const submitAnswer = api.quiz.submitAnswer.useMutation();

  const fetchQuestions = api.quiz.getQuiz.useQuery(
    {},
    {
      enabled: true,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (response: QuizResponse) => {
        setQuestions(response.questions);
        setQuestionNumber(1);
      },
    },
  );

  const handleAnswerClick = async (answer: string) => {
    if (isQuestionAnswered) {
      return;
    }

    const isAnswerCorrect = answer == questions.at(questionNumber - 1)?.answer;
    setIsQuestionAnswered(true);
    setIsAnswerCorrect(isAnswerCorrect);

    submitAnswer.mutate({
      word: answer,
      isAnswerCorrect: isAnswerCorrect,
    });
  };

  const handleNextClick = () => {
    if (questionNumber == questions.length) {
      // Refreshing the page will refetch the questions.
      window.location.reload();
      return;
    }

    setQuestionNumber(questionNumber + 1);
    setIsAnswerCorrect(false);
    setIsQuestionAnswered(false);
  };

  return (
    <>
      <Head>
        <title>Mehmet&apos;s Dictionary</title>
        <meta name="description" content="Mehmet's Dictionary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />

      <main className="top-align justify-top-center mx-auto flex max-w-screen-lg flex-col">
        {!fetchQuestions.isLoading && (
          <div className="mt-10 self-center text-xl font-bold">
            Quiz time! Choose the most similar word
          </div>
        )}

        <div className="flex min-h-96 flex-col items-center justify-center rounded-lg bg-gray-50 shadow-lg lg:m-5">
          {!fetchQuestions.isLoading && questions.length == 0 && (
            <div className="info m-4 text-xl font-bold text-green-400">
              You finished everything in this group. Come back later!
            </div>
          )}

          {fetchQuestions.isLoading && (
            <div className="info m-4 text-xl font-bold text-gray-500">
              Loading...
            </div>
          )}

          {questions.length > 0 && questionNumber > 0 && (
            <div className="info m-4 self-center italic">
              {questions.at(questionNumber - 1)?.info}
            </div>
          )}

          {questions.length > 0 && questionNumber > 0 && (
            <div className="question mt-4 flex flex-wrap">
              {questions.at(questionNumber - 1)?.synonyms.map((synonym) => {
                return (
                  <span
                    key={synonym}
                    className="m-2 rounded-lg bg-green-200 px-4 py-2
                  text-xl"
                  >
                    {synonym}
                  </span>
                );
              })}
            </div>
          )}

          {isQuestionAnswered && (
            <div className="h-4 border-t-0 bg-slate-100 opacity-100 dark:opacity-50"></div>
          )}

          {questions.length > 0 && questionNumber > 0 && (
            <div className="answers mt-2 flex flex-col text-xl">
              {questions.at(questionNumber - 1)?.choices.map((word) => {
                return (
                  <button
                    key={word}
                    className="m-2 rounded-md bg-gray-200 px-4 py-2"
                    onClick={() => handleAnswerClick(word)}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          )}

          {isQuestionAnswered && isAnswerCorrect && (
            <div className="result mt-10 self-center text-2xl text-green-400">
              Yeyy, correct answer.
            </div>
          )}

          {isQuestionAnswered && !isAnswerCorrect && (
            <div className="result mt-10 self-center text-2xl text-red-400">
              Wrong answer! The correct answer was{" "}
              {questions.at(questionNumber - 1)?.answer}
            </div>
          )}

          {isQuestionAnswered && (
            <div className="result m-10">
              <button
                className="m-2 rounded-md bg-gray-300 px-8 py-2 text-xl"
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
