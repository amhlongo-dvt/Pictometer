import type {DBCreateMessage, DBMessage} from "../models/db"
import {getGPTAnswer} from "./gpt"

export async function generateMessageResponse(message:DBCreateMessage)
:Promise<string>
{
    const params = {
        model: "black-forest-labs/FLUX.1-schnell-Free",
        steps: 3,
        n: 1,
    }

    const data = {
        ...params,
        prompt: message.message
    }

    return await getGPTAnswer(data);
    
}

export async function  generateEditMessageResponse(message:DBCreateMessage, imageUrl:String)
:Promise<string>
{
    const params = {
        model: "black-forest-labs/FLUX.1-depth",
        steps: 3,
        n: 1,
    }

    const data = {
        ...params,
        prompt: message.message,
        image_url: imageUrl
    }

    return await getGPTAnswer(data);  
} 
