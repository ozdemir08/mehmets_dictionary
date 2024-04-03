import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function generateDictionaryLookupPrompt(word: string): Promise<string> {

    const prompt = `Act as a dictionary. Give me the meaning of "${word}". 
The response may contain multiple "meaning"s. Each "meaning" should have a "part of speech", "pronunciation", "definition", "example sentences", "synonyms", "antonyms", "mnemonics", "etimology" and any additional fun information. 
"example sentences" should be very long for readers to understand its context. 
"mnemonics" should be made of simple words. 
The response should be in the markdown format as follows:
# Word


## Part of speech: ..

## Pronounciation: .. 

## Definition
.. 

## Example sentences
.. 

## Synonyms: ..

## Antonyms: .. 

## Mnemonics
..

## Etimology:
..

## Fun fact:
...

..

---

# Word
... `;

    return generateAnswer(prompt);
}


async function generateAnswer(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4',
    });

    if (response.choices.length == 0) {
        throw new Error('No response from OpenAI');
    }

    return response.choices[0]?.message.content || '';
}