import { Hono } from "hono";
import { type ContextVariables } from "../constants";
import type { 
    DBCreateImage,
    DBImage
 } from "../models/db";
import type { IDatabaseResource } from "../storage/types";

export const IMAGE_PREFIX = "/images/";
export const IMAGE_ROUTE = "";
export const IMAGE_ID_ROUTE = "/:imageId";
export const IMAGE_ID_EDIT_ROUTE = "/:imageId/edit";

import { randomUUIDv7, S3Client } from "bun";
import sharp from "sharp";

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
        const imageMetadata:DBCreateImage = {
            ownerId: userId, 
            contentType: file.type, 
            filename: file.name, 
            s3key, 
            size: file.size
        }
        
        const imageRes = await imageResource.create(imageMetadata)
        
        await client.write(s3key, fileBuffer,{type: file.type})

        return c.json({
            success: true,
            imageId: imageRes.id,
            metadata: imageMetadata
        })
    })

    imageApp.get(IMAGE_ID_ROUTE, async (c) => {
        const imageId = c.req.param("imageId")
        if(imageId){
            const imageMetadata = await imageResource.get(imageId)
            
            if(!imageMetadata){
                
                return c.json({error: "Image not found"}, 404)
            }

            try {
                const response = client.file(imageMetadata.s3key)

                c.header("Content-Type", imageMetadata.contentType);

                return c.body(await response.arrayBuffer())
            } catch (error) {
                
            }
        
        }else{
            return c.json({error: "Please specify a parameter for imageId"}, 400)
        }


    })

    imageApp.get(IMAGE_ROUTE, async (c) => {
        const userId = c.get("userId");
        const images = await imageResource.findAll({ownerId: userId})
        return c.json({images})
    })

    imageApp.post(IMAGE_ID_EDIT_ROUTE, async (c) => {
        const userId = c.get("userId");
        const imageId = c.req.param("imageId");
        
        const { transformations } = await c.req.json<{ transformations: ImageTransformations }>();
        
        if (!transformations) {
            return c.json({ error: "No valid transformations provided" }, 400);
        }
        
        const imageMetadata = await imageResource.get(imageId);
        
        if (!imageMetadata) {
            return c.json({ error: "Image not found" }, 404);
        }
        
        if (imageMetadata.ownerId !== userId) {
            return c.json({ error: "Unauthorized" }, 403);
        }
        
        try {
            const originalImage = client.file(imageMetadata.s3key);
            const imageBuffer = await originalImage.arrayBuffer();
            
            let sharpImage = sharp(imageBuffer);
            
            if (transformations.resize) {
                sharpImage = sharpImage.resize({
                    width: transformations.resize.width,
                    height: transformations.resize.height,
                    fit: "cover"
                });
            }
            
            if (transformations.crop) {
                sharpImage = sharpImage.extract({
                    left: transformations.crop.x,
                    top: transformations.crop.y,
                    width: transformations.crop.width,
                    height: transformations.crop.height
                });
            }
            
            if (transformations.rotate !== undefined) {
                sharpImage = sharpImage.rotate(transformations.rotate, {
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                });
            }
            
            if (transformations.filters) {
                if (transformations.filters.grayscale) {
                    sharpImage = sharpImage.grayscale();
                }
                
                if (transformations.filters.sepia) {
                    sharpImage = sharpImage
                        .modulate({ brightness: 1, saturation: 0.7 })
                        .tint({ r: 240, g: 200, b: 160 });
                }
            }
            
            if (transformations.format) {
                const format = transformations.format.toLowerCase();
                if (['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'].includes(format)) {
                    if (format === 'jpg') {
                        sharpImage = sharpImage.jpeg();
                    } else {
                        // @ts-ignore - format is dynamic
                        sharpImage = sharpImage[format]();
                    }
                }
            }
            
            const processedBuffer = await sharpImage.toBuffer();
            
            const filenameParts = imageMetadata.filename.split('.');
            const extension = filenameParts.pop();
            const basename = filenameParts.join('.');
            const newFilename = `${basename}-edited.${extension}`;
            const newS3key = `${userId}/${imageId}-${newFilename}`;
            
            await client.write(newS3key, processedBuffer, { type: imageMetadata.contentType });
            
            const newImageMetadata: DBCreateImage = {
                ownerId: userId,
                contentType: imageMetadata.contentType,
                filename: newFilename,
                s3key: newS3key,
                size: processedBuffer.length
            };
            
            const newImage = await imageResource.create(newImageMetadata);
            
            return c.json({
                success: true,
                originalImageId: imageId,
                newImageId: newImage.id,
                transformations: Object.keys(transformations).length
            });
            
        } catch (error) {
            console.error('Image processing error:', error);
            return c.json({ error: "Failed to process image" }, 500);
        }
    });

    return imageApp;
}

// Type definition for image transformations matching the reference JSON format
interface ImageTransformations {
    resize?: {
        width: number;
        height: number;
    };
    crop?: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    rotate?: number;
    format?: string;
    filters?: {
        grayscale?: boolean;
        sepia?: boolean;
    };
}