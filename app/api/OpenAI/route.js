import { Configuration, OpenAIApi } from "openai-edge";
import { StreamingTextResponse, OpenAIStream } from "ai";

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
    runtime: "edge",
};

export async function POST(request) {
    const { base64Image1, base64Image2 } = await request.json();

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "You are the highly knowledgeable scientific image analysis expert. Your task is to compare both the images and write a detailed case study of less than 1300 characters and greater than 800 characters in two to three paragraphs after comparing both the images .",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image1,
                            },
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image2,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 4000,
            temperature: 0,
            stream: true,
        });

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error(error);

        return new Response(JSON.stringify(error), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}
