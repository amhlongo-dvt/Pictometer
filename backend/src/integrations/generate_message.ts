import type { DBCreateMessage, DBMessage } from "../models/db"
import { getGPTAnswer, getGPTEditAnswer } from "./gpt"

export async function generateMessageResponse(message: string): Promise<string> {
    const params = {
        model: "black-forest-labs/FLUX-2-pro",
        n: 1,
        response_format: "b64_json",
        size: "1024x1024",
    }

    const data = {
        ...params,
        prompt: message
    }

    console.log(data)
    return await getGPTAnswer(data);
}

export async function generateEditMessageResponse(
    message: string,
    imageBuffer: Buffer,
    mask?: Buffer
): Promise<string> {
    const formData = new FormData();

    // Add required fields
    formData.append("model", "black-forest-labs/FLUX.1-Kontext-dev");
    formData.append("prompt", message);
    formData.append("n", "1");
    formData.append("response_format", "b64_json");
    formData.append("size", "1024x1024");

    // Add image as blob (convert Buffer to Uint8Array for compatibility)
    const imageBlob = new Blob([new Uint8Array(imageBuffer)], { type: "image/png" });
    formData.append("image", imageBlob, "image.png");

    // Add optional mask if provided
    if (mask) {
        const maskBlob = new Blob([new Uint8Array(mask)], { type: "image/png" });
        formData.append("mask", maskBlob, "mask.png");
    }

    console.log("Sending edit request with prompt:", message);
    return await getGPTEditAnswer(formData);
}
