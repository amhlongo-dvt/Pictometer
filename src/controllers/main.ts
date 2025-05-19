import { Hono } from "hono";
import{showRoutes} from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { cors} from "hono/cors"
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
import { rateLimitMiddleware } from "../middlewares/rateLimiting";
import { cacheMiddleware } from "../middlewares/cacheMiddleware";
import { Pool } from "pg";
import { UserSQLResource, ChatSQLResource, MessageSQLResorce, ImageSQLResource } from "../storage/sql";

const corsOptions = {
    origin: [Bun.env.CORS_ORIGIN as string],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400
}

export function createMainApp(
    authApp: Hono<ContextVariables>,
    chatApp: Hono<ContextVariables>,
    imageApp: Hono<ContextVariables>,
){
    const app = new Hono<ContextVariables>().basePath(API_PREFIX);
    app.use("*", cors(corsOptions))
    app.use("*", timing())
    app.use("*", logger())
    app.use("*", checkJWTAuth)
    app.use("*", attachUserId)
    app.use("*", rateLimitMiddleware)
    app.use("*", cacheMiddleware())

    app.route(AUTH_PREFIX, authApp);
    app.route(CHAT_PREFIX, chatApp);
    app.route(IMAGE_PREFIX, imageApp);

    // showRoutes(app)

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

export function createSQLApp(){
    const pool = new Pool({
        connectionString: Bun.env.DATABASE_URL,
    })
    console.log(pool);
    
    const userResource = new UserSQLResource(pool);
    const chatResource = new ChatSQLResource(pool);
    const messageResource = new MessageSQLResorce(pool);
    const imageResource = new ImageSQLResource(pool);
    const authApp = createAuthApp(userResource);
    const chatApp = createChatApp(chatResource, messageResource);
    const imageApp = createImageApp(imageResource)
    return createMainApp(authApp, chatApp, imageApp);
}