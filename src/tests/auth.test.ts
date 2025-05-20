import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp, createSQLApp, createORMApp } from "../controllers/main";
import { Pool } from "pg";
import { resetSQLDB, resetORMDB } from "./utils";
import { PrismaClient } from "@prisma/client";


describe("auth tests", () => {
    const app = createORMApp()
    
    const prisma = new PrismaClient()

    beforeEach( async () => {
        await resetORMDB(prisma)
    })

    test("POST /register - normal case", async () => {
        const jsonBody = {
            email: "test@example.com",
            password: "password123",
            name: "Test User"
        }

        const response =  await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });

        console.log(response);
        

        expect(response.status).toBe(200)
    })

    test("POST /register - user already exists", async () => {
        const jsonBody = {
            email: "test@example.com",
            password: "password123",
            name: "Test User"
        }

        await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });

        const response =  await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });
        

        expect(response.status).toBe(400)
    })

    test("POST /register - incorrect body", async () => {
        const jsonBody = {
            email: "example",
        };

        const response = await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });

        expect(response.status).toBe(400)

        expect(await response.json()).toEqual({
            success: false,
            error: {
                issues: [
                    {
                        validation: "email",
                        code: "invalid_string",
                        message: "Invalid email",
                        path: ["email"]    
                    },
                    {
                        code: "invalid_type",
                        expected: "string",
                        received: "undefined",
                        path: ["password"],
                        message: "Required"
                    },
                    {
                        code: "invalid_type",
                        expected: "string",
                        received: "undefined",
                        path: ["name"],
                        message: "Required"
                    },
                ],
                name: "ZodError",
            }
        })
    })

    test("POST /login - success", async () => {
        const res1 = await app.request("api/v1/chat/", {method: "GET"});
        expect(res1.status).toBe(401)

        const jsonBody = {
            email: "test@example.com",
            password: "password123",
            name: "Test User"
        }

        const registerRes = await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });

        console.log(registerRes);
        

        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
            }),
        });

        expect(loginRes.status).toBe(200)
        const token = (await loginRes.json())["token"]
        expect(token).toBeTruthy()

        const res2 = await app.request("api/v1/chat/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        expect(res2.status).toBe(200)
    })

    test("POST /login - invalid credentials", async () => {
        const jsonBody = {
            email: "test@example.com",
            password: "password123",
            name: "Test User"
        }

        await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonBody),
        });

        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "wrong-password",
            }),
        });

        expect(loginRes.status).toBe(401)
    })

    test("POST /login - non-existent user", async () => {
        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "non-existent@example.com",
                password: "password123",
            }),
        });

        expect(loginRes.status).toBe(401)
    })

    test("POST /login - incorrect body", async () => {
        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "wrong",
            }),
        });

        expect(loginRes.status).toBe(400)

        expect(await loginRes.json()).toEqual({
            success: false,
            error: {
                issues: [
                    {
                        validation: "email",
                        code: "invalid_string",
                        message: "Invalid email",
                        path: ["email"]    
                    },
                    {
                        code: "invalid_type",
                        expected: "string",
                        received: "undefined",
                        path: ["password"],
                        message: "Required"
                    },
                ],
                name: "ZodError",
            }
        })
    })
})