import { Hono } from "hono";
import type { ContextVariables } from "../constants";
import type { 
    DBChat,
    DBCreateChat,
    DBMessage,
    DBCreateMessage,
 } from "../models/db";
import type { IDatabaseResource } from "../storage/types";

export const CHAT_PREFIX = "/chat/";
export const CHAT_ROUTE = "";
export const CHAT_MESSAGE_ROUTE = ":id/message/";

export function createChatApp(
    chatResource: IDatabaseResource<DBChat, DBCreateChat>,
    messageResource: IDatabaseResource<DBMessage, DBCreateMessage>
) {
    const chatApp = new Hono<ContextVariables>();

    chatApp.post(CHAT_ROUTE, async (c) => {
        const userId = c.get("userId");
        const {name} = await c.req.json()
        const chat = await chatResource.create({name, ownerId: userId})
        return c.json({chat})
    })

    chatApp.get(CHAT_ROUTE, async (c) => {
        const userId = c.get("userId");
        const chats = await chatResource.findAll({ownerId: userId})
        return c.json({chats})
    })

    chatApp.get(CHAT_MESSAGE_ROUTE, async (c) => {
        const {id: chatId} = c.req.param()
        const chats = await messageResource.findAll({chatId})
        return c.json({chats})
    })

    chatApp.post(CHAT_MESSAGE_ROUTE, async (c) => {
        const {id: chatId} = c.req.param()
        const {message} = await c.req.json()

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