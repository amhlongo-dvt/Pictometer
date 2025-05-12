import { Hono } from "hono";
import type { ContextVariables } from "../constants";
import type { 
    DBChat,
    DBCreateChat,
    DBMessage,
    DBCreateMessage,
 } from "../models/db";
import type { IDatabaseResource } from "../storage/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const idSchema = z.object({
    id: z.string().min(1),
})

const chatSchema = z.object({
    name: z.string().min(1),
})

const messageSchema = z.object({
    message: z.string().min(1),
})

export const CHAT_PREFIX = "/chat/";
export const CHAT_ROUTE = "";
export const CHAT_DETAIL_ROUTE = ":id";
export const CHAT_MESSAGE_ROUTE = ":id/message/";

export function createChatApp(
    chatResource: IDatabaseResource<DBChat, DBCreateChat>,
    messageResource: IDatabaseResource<DBMessage, DBCreateMessage>
) {
    const chatApp = new Hono<ContextVariables>();

    chatApp.post(CHAT_ROUTE, zValidator("json", chatSchema), async (c) => {
        const userId = c.get("userId");
        const {name} = c.req.valid("json")
        const chat = await chatResource.create({name, ownerId: userId})
        return c.json({chat})
    })

    chatApp.get(CHAT_ROUTE, async (c) => {
        const userId = c.get("userId");
        const chats = await chatResource.findAll({ownerId: userId})
        return c.json({chats})
    })
    
    chatApp.get(CHAT_DETAIL_ROUTE, zValidator("param", idSchema), async (c) => {
        const {id} = c.req.valid("param")
        const userId = c.get("userId");
        const data = await chatResource.find({id, ownerId: userId})
        return c.json({data})
    })

    chatApp.get(CHAT_MESSAGE_ROUTE, zValidator("param", idSchema), async (c) => {
        const {id: chatId} = c.req.valid("param")
        const chats = await messageResource.findAll({chatId})
        return c.json({chats})
    })

    chatApp.post(CHAT_MESSAGE_ROUTE, zValidator("param", idSchema), zValidator("json", messageSchema), async (c) => {
        const {id: chatId} = c.req.valid("param")
        const {message} = c.req.valid("json")

        const userMessage: DBCreateMessage = {message, chatId, type:"user"}

        await messageResource.create(userMessage);

        const responseMessage: DBCreateMessage = {
            message: "dummy response",
            chatId,
            type: "system",
        };

        const data = await messageResource.create(responseMessage);

        return c.json({data});
    });

    return chatApp;
}