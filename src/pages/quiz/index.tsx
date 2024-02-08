import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { QuizResponse } from "~/server/api/schema/quiz";
import { Question } from "~/server/api/schema/quiz";

export default function Quiz() {
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  const submitAnswer = api.quiz.submitAnswer.useMutation();

  const fetchQuestions = api.quiz.getQuiz.useQuery({}, {
    enabled: true, retryOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (response: QuizResponse) => {
      setQuestions(response.questions);
      setQuestionNumber(1);
    }
  });

  const handleAnswerClick = async (answer: string) => {
    if (isQuestionAnswered) {
      return;
    }

    const isAnswerCorrect = answer == questions.at(questionNumber - 1)?.answer;
    setIsQuestionAnswered(true);
    setIsAnswerCorrect(isAnswerCorrect);

    submitAnswer.mutate({
      word: answer,
      isAnswerCorrect: isAnswerCorrect
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
  }

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

      <main className="max-w-screen-lg top-align flex flex-col justify-top-center mx-auto px-4">
        <div className="mt-10 text-xl self-center font-bold">Quiz time! Choose the
          most similar word</div>

        <div className="flex flex-col shadow-lg bg-gray-50 m-5 rounded-lg justify-center items-center min-h-96">
          {
            !fetchQuestions.isLoading && questions.length == 0 && (
              <div className="m-4 info text-xl text-green-400 font-bold">
                You finished everything in this group. Come back tomorrow!
              </div>
            )
          }

          {
            questions.length > 0 && questionNumber > 0 && (
              <div className="m-4 info self-center italic">
                {questions.at(questionNumber - 1)?.info}
              </div>
            )
          }

          {
            questions.length > 0 && questionNumber > 0 &&
            <div className="question flex flex-wrap mt-4">
              {
                questions.at(questionNumber - 1)?.synonyms.map(
                  synonym => {
                    return (
                      <span key={synonym} className="m-2 px-4 py-2 bg-green-200 rounded-lg
                  text-xl">
                        {synonym}
                      </span>
                    )
                  }
                )
              }
            </div>
          }

          {
            isQuestionAnswered &&
            <div className="h-4 border-t-0 bg-slate-100 opacity-100 dark:opacity-50"></div>
          }

          {
            questions.length > 0 && questionNumber > 0 &&
            <div className="answers mt-2 flex flex-col text-xl">
              {
                questions.at(questionNumber - 1)?.choices.map(word => {
                  return (
                    <button key={word} className="m-2 px-4 py-2 bg-gray-200 rounded-md"
                      onClick={() => handleAnswerClick(word)}>
                      {word}
                    </button>
                  )
                })}
            </div>
          }

          {
            isQuestionAnswered && isAnswerCorrect &&
            <div className="result mt-10 text-2xl self-center text-green-400">
              Yeyy, correct answer.
            </div>
          }

          {
            isQuestionAnswered && !isAnswerCorrect &&
            <div className="result mt-10 text-2xl self-center text-red-400">
              Wrong answer! The correct answer was {questions.at(questionNumber - 1)?.answer}
            </div>
          }

          {
            isQuestionAnswered && <div className="result m-10">
              <button className="bg-gray-300 m-2 px-8 py-2 rounded-md text-xl"
                onClick={handleNextClick}>Next</button>
            </div>
          }
        </div>
      </main >
    </>
  );
}
