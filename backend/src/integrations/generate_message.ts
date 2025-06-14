import type {DBCreateMessage, DBMessage} from "../models/db"
import {getGPTAnswer} from "./gpt"

export async function generateMessageResponse(message:string)
:Promise<string>
{
    const params = {
        model: "black-forest-labs/FLUX.1-schnell-Free",
        steps: 3,
        n: 1,
    }

    const data = {
        ...params,
        prompt: message
    }


    console.log(data)
    return await getGPTAnswer(data);
    
}

export async function  generateEditMessageResponse(message:string, imageUrl:String)
:Promise<string>
{
    const params = {
        model: "black-forest-labs/FLUX.1-canny",
        steps: 20,
        n: 1,
    }

    const data = {
        ...params,
        prompt: message,
        image_url: imageUrl
    }

    return await getGPTAnswer(data);  
} 
