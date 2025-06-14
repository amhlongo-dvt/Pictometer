import axios from "axios";
import { API_HOST } from "../constants";

export interface Chat {
    id: string;
    name: string;
}

export interface Message {
    imageId: string, 
    imageUrl: string, 
    chatId:string, 
    id:string
}

export interface ChatListResponse {
    data: Chat[];
}

export interface ChatMessageResponse {
    chats: Message[];
}

export interface CreateChatResponse {
    chat: Chat;
}

/**
 * Get a list of all chats
 */
export async function getChatList(): Promise<ChatListResponse> {
    const response = await axios.get(`${API_HOST}/api/v1/chat/`);
    return response.data;
}

/**
 * Create a new chat
 */
export async function createChat(name: string): Promise<CreateChatResponse> {
    const response = await axios.post(`${API_HOST}/api/v1/chat/`, { name });
    return response.data;
}

/**
 * Get messages for a specific chat
 */
export async function getChatMessages(chatId: string): Promise<ChatMessageResponse> {
    const response = await axios.get(`${API_HOST}/api/v1/chat/${chatId}/message/`);
    return response.data;
}

/**
 * Send a message to a specific chat
 */
export async function sendMessage(chatId: string, imageUrl: string, imageId: string): Promise<void> {
    await axios.post(`${API_HOST}/api/v1/chat/${chatId}/message/`, { imageUrl,imageId });
}

/**
 * Send a message to a specific chat
 */
export async function sendMessageWithImage(chatId: string, message: string, imageUrl: string): Promise<void> {
    await axios.post(`${API_HOST}/api/v1/chat/${chatId}/message/`, { message, imageUrl });
}
