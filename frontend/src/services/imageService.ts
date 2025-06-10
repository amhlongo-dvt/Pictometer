import axios from "axios";
import { API_HOST } from "../constants";

export interface Image {
    id: string;
    filename: string;
    contentType: string;
    size: number;
    s3key: string;
}
export interface ImageResponse {
    imageId: string;
    imageUrl: string;
    metadata: Image;
    success: boolean;
}

export interface ImageListResponse {
    data: Image[];
}

export interface CreateImageResponse {
    imageId: string;
    metadata: Image;
}

export interface ImageTransformations {
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
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    contrast?: number;
    brightness?: number;
    saturation?: number;
}
/**
 * Get a list of all images
 */
export async function getChatList(): Promise<ImageListResponse> {
    const response = await axios.get(`${API_HOST}/api/v1/image/`);
    return response.data;
}

/**
 * Create a new image
 */
export async function createImage(file: File): Promise<CreateImageResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_HOST}/api/v1/image/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function getImage(imageId: string): Promise<ImageResponse> {
    const response = await axios.get(`${API_HOST}/api/v1/image/${imageId}`);
    return response.data;
}

export async function generateImage(url: string): Promise<ImageResponse> {
    const response = await axios.post(`${API_HOST}/api/v1/image/generate`, { url });
    return response.data;
}

export async function editImage(imageId: string, transformations: ImageTransformations): Promise<ImageResponse> {
    const response = await axios.post(`${API_HOST}/api/v1/image/${imageId}/edit`, { transformations });
    return response.data;
}
