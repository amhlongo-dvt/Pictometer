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
    DBCreateUser
} from '../models/db'

import { SimpleInMemoryResource } from "../storage/inmemory";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";

export function createMainApp(
    authApp: Hono<ContextVariables>,
    chatApp: Hono<ContextVariables>
){
    const app = new Hono<ContextVariables>().basePath(API_PREFIX);
    app.use("*", timing())
    app.use("*", logger())
    app.use("*", checkJWTAuth)
    app.use("*", attachUserId)

    app.route(AUTH_PREFIX, authApp);
    app.route(CHAT_PREFIX, chatApp);

    showRoutes(app)

    return app;
}

export function createInMemoryApp(){
    const userResource = new SimpleInMemoryResource<DBUser, DBCreateUser>();
    const chatResource = new SimpleInMemoryResource<DBChat, DBCreateChat>();
    const messageResource = new SimpleInMemoryResource<DBMessage, DBCreateMessage>();
    const authApp = createAuthApp(userResource);
    const chatApp = createChatApp(chatResource, messageResource);
    return createMainApp(authApp, chatApp);
}