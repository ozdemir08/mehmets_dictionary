import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function generateDictionaryLookupPrompt(word: string): Promise<string> {

    const prompt = `Act as a dictionary. Give me the meaning of "${word}". 
The response may contain multiple "meaning"s. Each "meaning" should have a "part of speech", "pronunciation", "definition", "example sentences", "synonyms", "antonyms" and any additional fun information. The response must be in the markdown format. `;

    return generateAnswer(prompt);
}


async function generateAnswer(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });


    if (response.choices.length == 0) {
        throw new Error("No response from GPT");
    }

    return response.choices[0]?.message.content as string;
}