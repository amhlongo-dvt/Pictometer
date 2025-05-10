import { Hono } from "hono";
import{showRoutes} from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import type { ContextVariables } from "../constants";
import { API_PREFIX } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import type{
    DBChat,
    DBCreateChat,
    DBMessage,
    DBCreateMessage,
    DBUser,
    DBCreateUser,
    DBImage,
    DBCreateImage
} from '../models/db'

import { SimpleInMemoryResource } from "../storage/inmemory";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";
import { createImageApp, IMAGE_PREFIX } from "./image";

export function createMainApp(
    authApp: Hono<ContextVariables>,
    chatApp: Hono<ContextVariables>,
    imageApp: Hono<ContextVariables>,
){
    const app = new Hono<ContextVariables>().basePath(API_PREFIX);
    app.use("*", timing())
    app.use("*", logger())
    // app.use("*", checkJWTAuth)
    // app.use("*", attachUserId)

    app.route(AUTH_PREFIX, authApp);
    app.route(CHAT_PREFIX, chatApp);
    app.route(IMAGE_PREFIX, imageApp);

    showRoutes(app)

    return app;
}

export function createInMemoryApp(){
    const userResource = new SimpleInMemoryResource<DBUser, DBCreateUser>();
    const chatResource = new SimpleInMemoryResource<DBChat, DBCreateChat>();
    const messageResource = new SimpleInMemoryResource<DBMessage, DBCreateMessage>();
    const imageResource = new SimpleInMemoryResource<DBImage, DBCreateImage>();
    const authApp = createAuthApp(userResource);
    const chatApp = createChatApp(chatResource, messageResource);
    const imageApp = createImageApp(imageResource)
    return createMainApp(authApp, chatApp, imageApp);
}