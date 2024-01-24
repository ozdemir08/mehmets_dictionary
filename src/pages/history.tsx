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
      <div className="flex flax-wrap flex-col m-2">
        <h3 className="text-2xl text-black">Lookup history</h3>
        <div>
          {history.error?.message}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4">
          {
            history.data?.length == 0 ?
              <div> You have not looked up any words yet.</div> : (
                history.data?.map(
                  entry => {
                    return (
                      <div key={entry.word} className="my-2">
                        <a href={'/?word=' + entry.word.toLowerCase()}
                          className="px-2 py-1 bg-gray-200 rounded-md">
                          {entry.word}
                        </a>
                        <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-md text-xs">{entry.lookUpCount}</span>
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
