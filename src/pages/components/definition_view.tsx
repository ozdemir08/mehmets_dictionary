import { api } from "~/utils/api";

export default function DefinitionView(props: { word: string | undefined }) {
  const word = props.word;

  const playAudio = async (audio: string) => {
    if (audio == "") {
      return;
    }

    await new Audio(audio).play();
  };

  const lookUpResult = api.dictionary.lookUpV2.useQuery(
    { word: word! },
    {
      enabled: word != null,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <div className="justify-top disabled container mx-2 flex flex-col">
        {word != null && lookUpResult.isLoading && (
          <div className="mt-10 self-center">Loading...</div>
        )}

        {lookUpResult.error != null && <div>{lookUpResult.error?.message}</div>}

        <div>
          {lookUpResult.data?.words.map((word, index) => {
            return (
              <div key={word.word + index}>
                <div className="py-4 text-4xl text-gray-800"> {word.word} </div>
                <div className="mt-2 flex flex-row">
                  {word.phonetics.map(
                    (phonetic, index) =>
                      phonetic.audio != "" &&
                      phonetic.audio != null && (
                        <div
                          key={phonetic.text + index}
                          className="mr-2 pe-2 text-gray-700"
                          onClick={() => playAudio(phonetic.audio)}
                        >
                          {phonetic.text}
                        </div>
                      ),
                  )}
                </div>
                <div>
                  {word.meanings.map((meaning, index) => {
                    return (
                      <div key={meaning.partOfSpeech + index} className="py-4">
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
                {word.mnemonics && (
                  <div className="py-4">
                    <div className="font-semi-bold text-2xl text-gray-700">Mnemonics</div>
                    <div>{word.mnemonics}
                    </div>
                  </div>)}
                {word.etymology && (<div className="py-4">
                  <div className="font-semi-bold text-2xl text-gray-700">Etymology</div>
                  <div>{word.etymology}</div>
                </div>)}
                {word.funFact && (<div className="py-4 ">
                  <div className="font-semi-bold text-2xl text-gray-700">Fun fact</div>
                  <div>{word.funFact}</div>
                </div>)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
