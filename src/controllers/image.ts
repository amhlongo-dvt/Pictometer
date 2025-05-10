import { Hono } from "hono";
import type { ContextVariables } from "../constants";
import type { 
    DBCreateImage,
    DBImage
 } from "../models/db";
import type { IDatabaseResource } from "../storage/types";

export const IMAGE_PREFIX = "/image/";
export const IMAGE_ROUTE = "";
export const IMAGE_ID_ROUTE = ":id/message/";



export function createImageApp(
    imageResource: IDatabaseResource<DBImage, DBCreateImage>
) {
    const imageApp = new Hono<ContextVariables>();

    imageApp.post(IMAGE_ROUTE, async (c) => {
        const userId = c.get("userId");
        
        const body = await c.req.parseBody<{ [x: string]: string | File; }>()
        console.log(body['file'])
        
        const data = body['file']
        // const chat = await imageResource.create({imageUrl, ownerId: userId})
        return c.json({body: body['file'].toString()})
    })

    // chatApp.get(CHAT_ROUTE, async (c) => {
    //     const userId = c.get("userId");
    //     const chats = await chatResource.findAll({ownerId: userId})
    //     return c.json({chats})
    // })

    // chatApp.get(CHAT_MESSAGE_ROUTE, async (c) => {
    //     const {id: chatId} = c.req.param()
    //     const chats = await messageResource.findAll({chatId})
    //     return c.json({chats})
    // })

    // chatApp.post(CHAT_MESSAGE_ROUTE, async (c) => {
    //     const {id: chatId} = c.req.param()
    //     const {message} = await c.req.json()

    //     const userMessage: DBCreateMessage = {message, chatId, type:"user"}

    //     await messageResource.create(userMessage);

    //     const responseMessage: DBCreateMessage = {
    //         message: "dummy response",
    //         chatId,
    //         type: "system",
    //     };

    //     const data = await messageResource.create(responseMessage);

    //     return c.json({data});
    // });

    return imageApp;
}