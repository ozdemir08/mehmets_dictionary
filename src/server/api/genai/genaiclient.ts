import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function generateDictionaryLookupPrompt(word: string): Promise<string> {
    const promptJson = `
    Act as a dictionary. Give me the meaning of "${word}". 
The response may contain multiple "meaning"s. Each "meaning" should have a "part of speech", "pronunciation", "definition", "example sentences", "synonyms", "antonyms", "mnemonics", "etimology" and any additional fun information. 
"example" should be a paragraph that would give readers enough context with the word. 
"mnemonics" should be made of simple words. 
The response should be in the json format as follows:

    [
        {
            "word": "...",
            "phonetic": "...",
            "phonetics": [
                {
                    "text": "...",
                    "audio": "..."
                }
            ],
            "meanings": [
                {
                    "partOfSpeech": "...",
                    "definitions": [
                        {
                            "definition": "...",
                            "synonyms": [],
                            "antonyms": [],
                            "example": "..."
                        },
                        {
                            "definition": "...",
                            "synonyms": [...],
                            "antonyms": [...],
                            "example": "..."
                        },
                        {
                            "definition": "...",
                            "synonyms": [...],
                            "antonyms": [...]
                        },
                    ]
                }
            ],
            "mnemonics": "...",
            "etymology": "...",
            "funFact": "..."
        }
    ]
    `;

    return generateAnswer(promptJson);
}


async function generateAnswer(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    if (response.choices.length == 0) {
        throw new Error('No response from OpenAI');
    }

    return response.choices[0]?.message.content ?? '';
}