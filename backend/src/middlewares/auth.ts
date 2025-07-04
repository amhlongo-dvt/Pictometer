import type { Context } from "hono";
import {env} from "hono/adapter";
import {jwt} from "hono/jwt";
import { API_PREFIX } from "../constants";
import { AUTH_PREFIX, LOGIN_ROUTE, REGISTER_ROUTE } from "../controllers/auth";
import type { APIUser } from "../models/api";
import { IMAGE_PREFIX, IMAGE_ROUTE_DOWNLOAD } from "../controllers/image";

export async function checkJWTAuth(
    c: Context, 
    next: () => Promise<void>
) : Promise<Response | void> {
    if(
        c.req.path === API_PREFIX + AUTH_PREFIX + LOGIN_ROUTE ||
        c.req.path === API_PREFIX + AUTH_PREFIX + REGISTER_ROUTE ||
        c.req.path.startsWith(API_PREFIX + IMAGE_PREFIX + "download") 

    ){
        return await next()
    }else{
     const { JWT_SECRET } = env<{JWT_SECRET: string}>(c);
     const jwtMiddleware = jwt({
        secret: JWT_SECRET,
     })
     return jwtMiddleware(c, next)
    }
}

export async function attachUserId(
    c:Context,
    next: () => Promise<void>
): Promise<Response | void>{
    const payload = c.get("jwtPayload") as APIUser;
    if(payload){
        c.set("userId", payload.id);   
    }
    await next();
}