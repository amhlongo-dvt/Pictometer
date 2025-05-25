export async function callGPTAPI(data:object ){
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Bun.env.MISTRAL_API_KEY}`
        },
        body: JSON.stringify(data)
    })
    return res
}