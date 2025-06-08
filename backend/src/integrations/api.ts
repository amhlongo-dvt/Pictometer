import {HTTPException} from "hono/http-exception"
export async function callGPTAPI(data:object ){
    try {
        const res = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Bun.env.TOGETHER_API_KEY}`
        },
        body: JSON.stringify(data)
    })
    return res
    } catch (error) {
        throw new HTTPException(503, {message: error as string})
    }
}