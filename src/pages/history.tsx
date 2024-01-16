import { useState } from "react";
import { HistoryResponse } from "~/server/api/schema/dictionary";
import { api } from "~/utils/api";

export default function History() {

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [history, setHistory] = useState<HistoryResponse>();

  api.dictionary.getHistory.useQuery({},
    {
      onSuccess: (response) => {
        console.log(response);
        setHistory(response);
        setErrorMessage('');
      },
      onError: (e) => {
        console.log(e);
        setErrorMessage(e.message);
      },
    }
  );

  return (
    <>
      <div className="flex flax-wrap flex-col">
        <h3 className="text-2xl text-gray-600">Lookup history</h3>
        <div>
          {errorMessage}
        </div>

        <div>
          {
            history?.length == 0 ?
              <div> You have not looked up any words yet.</div> : (
                history?.map(
                  entry => {
                    return (
                      <div key={entry.word}>
                        {entry.word} - {entry.lookUpCount}
                      </div>
                    );
                  }
                )
              )}
        </div>
      </div>
    </>
  )
}
