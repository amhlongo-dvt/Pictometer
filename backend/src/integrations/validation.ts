import {z} from "zod"

const GPTResponseSchema = z.object({
    id: z.string(),
    model: z.string(),
    object: z.string(),
    data: z.array(
        z.object({
            index: z.number(),
            url: z.string(),
            
        })
    )
});

export async function validateGPTResponse(response:Response):
Promise<string> {
    const responseData = await response.json();
    console.log(responseData);
    
    try {
        const parsed = GPTResponseSchema.parse(responseData);
        const content = parsed.data[0].url.trim();
        return content;
    } catch (error) {
        throw new Error(`Invalid API response format, format ${error}`)
    }
}