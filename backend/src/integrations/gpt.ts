import { HTTPException } from "hono/http-exception"
import { callGPTAPI, callGPTEditAPI } from "./api"
import { retryWrapper } from "./retry"
import { validateGPTResponse } from "./validation"

export async function getGPTAnswer(data: object) {
    try {
        const response = await retryWrapper(() => callGPTAPI(data))
        const message = await validateGPTResponse(response)
        return message
    } catch {
        throw new HTTPException(503, { message: "GPT integration is down" })
    }
}

export async function getGPTEditAnswer(formData: FormData) {
    try {
        const response = await retryWrapper(() => callGPTEditAPI(formData))
        const message = await validateGPTResponse(response)
        return message
    } catch {
        throw new HTTPException(503, { message: "GPT edit integration is down" })
    }
}
