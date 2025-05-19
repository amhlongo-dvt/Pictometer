import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp } from "../controllers/main";

describe("chat tests", () => {
    let app = createInMemoryApp()
    
    beforeEach(() => {
        app = createInMemoryApp()
    })


    async function  getToken(email="test@test.com"):Promise<string>{
        await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password: "password123",
                name: "Test User"
            }),
        });

        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password: "password123",
            }),
        });

        const token = (await loginRes.json())["token"]
        return token
    }

    async function createChat(token:string) {
        const createChatRes = await app.request("api/v1/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: "Test Chat"
            }),
        });

        const response = await createChatRes.json()
        console.log(response);
        
        const chatId =  response.chat.id
        return chatId
    }

    test("GET /chat/ - get user chats", async () => {
        const token = await getToken()
        const chatId = await createChat(token)

        const res = await app.request("api/v1/chat/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        expect(res.status).toBe(200)
        const response = await res.json()
        const data = response.data
        expect(Array.isArray(data)).toBeTruthy()
        expect(data.length).toBe(1)
        expect(data[0].id).toBe(chatId)
    })

    test("GET /chat/ get user chats when multiple chat and users are available", async () => {
        const token = await getToken()
        const token2 = await getToken("test2@test.com")
        const chatId = await createChat(token)
        const chatId2 = await createChat(token2)

        const res = await app.request("api/v1/chat/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        expect(res.status).toBe(200)
        const response = await res.json()
        console.log(response);
        
        const data = response.data

        expect(Array.isArray(data)).toBeTruthy()
        expect(data.length).toBe(1)
        expect(data[0].id).toBe(chatId)

        const response2 = await app.request("api/v1/chat/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token2}`
            }
        })

        expect(response2.status).toBe(200)
        const response2Data = await response2.json()
        const data2 = response2Data.data
        expect(Array.isArray(data2)).toBeTruthy()
        expect(data2.length).toBe(1)
        expect(data2[0].id).toBe(chatId2)
    })

    test("POST /chat - incorrect body", async () => {
        const token = await getToken()
        const jsonBody = {
            name: ""
        }

        const res = await app.request("api/v1/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(jsonBody),
        })

        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({
            success: false,
            error: {
                issues: [
                    {
                        code: "too_small",
                        minimum: 1,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: "String must contain at least 1 character(s)",
                        path: ["name"]
                    },
                ],
                name: "ZodError"
            },
        });
    });
    
    test("GET /chat/:id/message/ - create and get chat messages", async () => {
        const token = await getToken()
        const chatId = await createChat(token)

        await app.request(`api/v1/chat/${chatId}/message/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: "test message"
            })
        })

        const res = await app.request(`api/v1/chat/${chatId}/message/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        expect(res.status).toBe(200)
        const messages = await res.json()
        expect(messages.chats).toBeInstanceOf(Array)
        expect(messages.chats.length).toBe(2)
        expect(messages.chats[0].message).toBe("test message")
        expect(messages.chats[1].message).toBe("dummy response")
    })

    test("POST /chat/:id/message/ - incorrect body", async () => {
        const token = await getToken()
        const res = await app.request(`api/v1/chat/a/message/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({})
        })

        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({
            success: false,
            error: {
                issues: [
                    {
                       code: "invalid_type",
                       expected: "string",
                       received: "undefined",
                       path: ["message"],
                       message: "Required"
                    },
                ],
                name: "ZodError"
            },
        });
    });
});