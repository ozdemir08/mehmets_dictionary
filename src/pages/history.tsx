import { api } from "~/utils/api";

export default function History() {

  const history = api.dictionary.getHistory.useQuery({}, {
    retryOnMount: false, cacheTime: Infinity, refetchOnWindowFocus: false,
  });

  if (!history.isFetched || history.data?.length == 0) {
    return null;
  }

  return (
    <>
      <div className="flex flax-wrap flex-col m-2 sm:items-center">
        <h3 className="text-2xl text-gray-600">Lookup history</h3>
        <div>
          {history.error?.message}
        </div>

        <div>
          {
            history.data?.length == 0 ?
              <div> You have not looked up any words yet.</div> : (
                history.data?.map(
                  entry => {
                    return (
                      <div key={entry.word} className="my-2">
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
