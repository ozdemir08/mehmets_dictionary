import { api } from "~/utils/api";

export default function History() {
  const history = api.dictionary.getHistory.useQuery(
    {},
    {
      retryOnMount: false,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  if (!history.isFetched || history.data?.length == 0) {
    return null;
  }

  return (
    <>
      <div className="flax-wrap m-2 flex flex-col">
        <h3 className="text-xl text-black">Lookup history</h3>

        {history.error != null && <div>{history.error?.message}</div>}

        {history.isLoading && <div>History loading...</div>}

        <div className="grid grid-cols-2 sm:grid-cols-4">
          {history.data?.length == 0 ? (
            <div> You have not looked up any words yet.</div>
          ) : (
            history.data?.map((entry) => {
              return (
                <div key={entry.word} className="my-2">
                  <a
                    href={"/?word=" + entry.word.toLowerCase()}
                    className="rounded-md bg-gray-200 px-2 py-1 hover:bg-gray-300"
                  >
                    {entry.word}
                  </a>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {entry.lookUpCount}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
