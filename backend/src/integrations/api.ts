import { HTTPException } from "hono/http-exception"

export async function callGPTAPI(data: object) {
    try {
        const res = await fetch("https://api.deepinfra.com/v1/openai/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Bun.env.DEEP_INFRA_API_KEY}`
            },
            body: JSON.stringify(data)
        })
        return res
    } catch (error) {
        throw new HTTPException(503, { message: error as string })
    }
}

export async function callGPTEditAPI(formData: FormData) {
    try {
        const res = await fetch("https://api.deepinfra.com/v1/openai/images/edits", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Bun.env.DEEP_INFRA_API_KEY}`
            },
            body: formData
        })
        return res
    } catch (error) {
        throw new HTTPException(503, { message: error as string })
    }
}
