import { Hono } from "hono";
import { API_PREFIX, type ContextVariables } from "../constants";
import type { 
    DBCreateImage,
    DBImage
 } from "../models/db";
import type { IDatabaseResource } from "../storage/types";

export const IMAGE_PREFIX = "/images/";
export const IMAGE_ROUTE = "";
export const IMAGE_ID_ROUTE = ":id/message/";

import { randomUUIDv7, S3Client } from "bun";

const client = new S3Client({
  accessKeyId: "minioadmin",
  secretAccessKey: "minioadmin",
  bucket: "images",
  endpoint: "http://localhost:9000",
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function createImageApp(
    imageResource: IDatabaseResource<DBImage, DBCreateImage>
) {
    const imageApp = new Hono<ContextVariables>();

    imageApp.post(IMAGE_ROUTE, async (c) => {
        const userId = c.get("userId");
        
        const body = await c.req.parseBody<{ [x: string]: string | File; }>()
        const file  = body['file']
        
        if (!file || !(file instanceof File)){
            return c.json({error: "No valid file uploaded"}, 400)
        }

        if (!file.type.startsWith("image/")) {
            return c.json({error: "File must be an image"}, 400)
        }
        
        if(file.size > MAX_FILE_SIZE){
            return c.json({error: "File too large (max 5MB)"}, 400)
        }

        const imageId = randomUUIDv7();
        const s3key = `${userId}/${imageId}-${file.name}`;

        const fileBuffer = await file.arrayBuffer();
        const ImageMetadata:DBCreateImage = {
            ownerId: userId, 
            contentType: file.type, 
            filename: file.name, 
            s3key, 
            size: file.size
        }
        
        const imageRes = await imageResource.create(ImageMetadata)
        
        await client.write(s3key, fileBuffer,{type: file.type})

        return c.json({
            success: true,
            imageId: imageRes.id,
            metadata: ImageMetadata
        })
    })
    
    return imageApp;
}