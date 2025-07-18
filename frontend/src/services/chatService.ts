// import axios from "axios";

import api from "./api"

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
    const response = await api.get(`/api/v1/chat/`);
    return response.data;
}

/**
 * Create a new chat
 */
export async function createChat(name: string): Promise<CreateChatResponse> {
    const response = await api.post(`/api/v1/chat/`, { name });
    return response.data;
}

/**
 * Get messages for a specific chat
 */
export async function getChatMessages(chatId: string): Promise<ChatMessageResponse> {
    const response = await api.get(`/api/v1/chat/${chatId}/message/`);
    return response.data;
}

/**
 * Send a message to a specific chat
 */
export async function sendMessage(chatId: string, imageUrl: string, imageId: string): Promise<void> {
    await api.post(`/api/v1/chat/${chatId}/message/`, { imageUrl,imageId });
}

/**
 * Send a message to a specific chat
 */
export async function sendMessageWithImage(chatId: string, message: string, imageUrl: string): Promise<void> {
    await api.post(`/api/v1/chat/${chatId}/message/`, { message, imageUrl });
}

/**
 * Delete a message to a specific chat
 */
export async function deleteMessage(id:string): Promise<void> {
    await api.delete(`/api/v1/chat/message/${id}`);
}
/**
 * Delete a message to a specific chat
 */
export async function updateMessage(id:string,chatId: string, imageUrl: string, imageId: string): Promise<void> {
    await api.put(`/api/v1/chat/message/${id}`, { imageUrl,imageId, chatId});
}

export async function getMessage(id:string): Promise<Message> {
    const response = await api.get(`/api/v1/chat/message/${id}`);
    return response.data.data;
}
