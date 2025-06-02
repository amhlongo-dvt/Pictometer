import axios from "axios";
import { API_HOST } from "../constants";

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
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_HOST}/api/v1/auth/login/`, request);
    return response.data;
}

/**
 * Registers a new user
 */
export async function register(request: RegisterRequest): Promise<void> {
    await axios.post(`${API_HOST}/api/v1/auth/register/`, request);
}
