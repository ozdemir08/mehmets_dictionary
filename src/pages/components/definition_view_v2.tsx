import { api } from "~/utils/api";
import Markdown from 'react-markdown'

export default function DefinitionView2(props: { word: string | undefined }) {
    const word = props.word;

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
                    {lookUpResult.data ? (<Markdown>{lookUpResult.data}</Markdown>) : null}
                </div>
            </div>
        </>
    );
}
