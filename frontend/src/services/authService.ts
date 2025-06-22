// import axios from "axios";
import { API_HOST } from "../constants";
import api from "./api"


export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    token: string;
}

/**
 * Logs in a user with email and password
 * 
 * @param request - An object containing the user's email and password.
 * @returns A promise that resolves to an AuthResponse object containing the user's authentication token.
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await api.post(`/api/v1/auth/login/`, request);
    return response.data;
}


/**
 * Registers a new user with the provided email, password, and name.
 * 
 * @param request - An object containing the user's email, password, and name.
 * @returns A promise that resolves when the registration is successful.
 */
export async function register(request: RegisterRequest): Promise<void> {
    await api.post(`/api/v1/auth/register/`, request);
}
