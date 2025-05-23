import type {DBMessage} from "../models/db"
import {getGPTAnswer} from "./gpt"

export async function generateMessageResponse(messages:DBMessage[])
:Promise<string>
{
    const params = {
        model: "mistral-small-latest",
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        n: 1,
        stream: false,
    }

    const data = {
        ...params,
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            ...messages.map((message) => ({
                role: message.type,
                content: message.message,
            }))
        ]
    }

    return getGPTAnswer(data);
}
