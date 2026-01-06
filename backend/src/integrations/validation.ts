import { z } from "zod"

const GPTResponseSchema = z.object({
    id: z.string().optional(),
    model: z.string().optional(),
    object: z.string().optional(),
    data: z.array(
        z.object({
            index: z.number().optional(),
            b64_json: z.string(),
        })
    )
});

export async function validateGPTResponse(response: Response): Promise<string> {
    const responseData = await response.json();
    // console.log(responseData);

    try {
        const parsed = GPTResponseSchema.parse(responseData);
        const content = parsed.data[0].b64_json.trim();
        return content;
    } catch (error) {
        throw new Error(`Invalid API response format, format ${error}`)
    }
}
