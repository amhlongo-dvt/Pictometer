import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp } from "../controllers/main";
import { randomUUIDv7 } from "bun";

describe("image tests", () => {
    let app = createInMemoryApp();
    let token: string;
    
    beforeEach(async () => {
        app = createInMemoryApp();
        
        // Register and login to get auth token for subsequent requests
        const registerBody = {
            email: "image-test@example.com",
            password: "password123",
            name: "Image Test User"
        };

        await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody),
        });

        const loginRes = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "image-test@example.com",
                password: "password123",
            }),
        });

        token = (await loginRes.json()).token;
    });

    test("POST /images - upload image success", async () => {
        // Create a sample image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]); // Simple 1x1 GIF

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const response = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        expect(response.status).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.success).toBe(true);
        expect(responseBody.imageId).toBeDefined();
        expect(responseBody.metadata).toBeDefined();
    });

    test("POST /images - upload invalid file type", async () => {
        const textData = new TextEncoder().encode("This is not an image");
        const file = new File([textData], "not-an-image.txt", { type: "text/plain" });
        
        const formData = new FormData();
        formData.append("file", file);

        const response = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error).toContain("File must be an image");
    });

    test("POST /images - missing file", async () => {
        const formData = new FormData();
        // No file attached

        const response = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error).toContain("No valid file uploaded");
    });

    test("GET /images - list user images", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        // Now get the list
        const response = await app.request("api/v1/images/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(Array.isArray(responseBody.images)).toBe(true);
        expect(responseBody.images.length).toBeGreaterThan(0);
    });

    test("GET /images/:imageId - get specific image", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Now get the specific image
        const response = await app.request(`api/v1/images/${imageId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toContain("image/");
    });

    test("GET /images/:imageId - image not found", async () => {
        const nonExistentId = randomUUIDv7();
        
        const response = await app.request(`api/v1/images/${nonExistentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.error).toContain("Image not found");
    });

    test("POST /images/:imageId/edit - resize image", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Now edit the image with resize transformation
        const transformations = {
            resize: {
                width: 200,
                height: 200
            }
        };

        const editResponse = await app.request(`api/v1/images/${imageId}/edit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ transformations })
        });

        expect(editResponse.status).toBe(200);
        const responseBody = await editResponse.json();
        expect(responseBody.success).toBe(true);
        expect(responseBody.originalImageId).toBe(imageId);
        expect(responseBody.newImageId).toBeDefined();
    });

    test("POST /images/:imageId/edit - multiple transformations", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Now edit the image with multiple transformations
        const transformations = {
            resize: {
                width: 300,
                height: 200
            },
            rotate: 90,
            filters: {
                grayscale: true
            },
            format: "png"
        };

        const editResponse = await app.request(`api/v1/images/${imageId}/edit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ transformations })
        });

        expect(editResponse.status).toBe(200);
        const responseBody = await editResponse.json();
        expect(responseBody.success).toBe(true);
        expect(responseBody.transformations).toBeGreaterThan(0);
    });

    test("POST /images/:imageId/edit - crop transformation", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Now edit the image with crop transformation
        const transformations = {
            crop: {
                width: 1,
                height: 1,
                x: 0,
                y: 0
            }
        };

        const editResponse = await app.request(`api/v1/images/${imageId}/edit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ transformations })
        });

        expect(editResponse.status).toBe(200);
        const responseBody = await editResponse.json();
        expect(responseBody.success).toBe(true);
    });

    test("POST /images/:imageId/edit - invalid transformations", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Send invalid transformation data
        const response = await app.request(`api/v1/images/${imageId}/edit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({}) // Missing transformations object
        });

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error).toContain("No valid transformations provided");
    });

    test("POST /images/:imageId/edit - unauthorized access", async () => {
        // First upload an image
        const imageData = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
            0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]);

        const file = new File([imageData], "test-image.gif", { type: "image/gif" });
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await app.request("api/v1/images/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const { imageId } = await uploadResponse.json();

        // Create a second user
        const registerBody2 = {
            email: "second-user@example.com",
            password: "password123",
            name: "Second User"
        };

        await app.request("api/v1/auth/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody2),
        });

        const loginRes2 = await app.request("api/v1/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "second-user@example.com",
                password: "password123",
            }),
        });

        const token2 = (await loginRes2.json()).token;

        // Try to edit first user's image with second user's token
        const transformations = {
            resize: {
                width: 200,
                height: 200
            }
        };

        const editResponse = await app.request(`api/v1/images/${imageId}/edit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ transformations })
        });

        expect(editResponse.status).toBe(403);
        const responseBody = await editResponse.json();
        expect(responseBody.error).toContain("Unauthorized");
    });
});
