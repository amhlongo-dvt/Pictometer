import { writable } from "svelte/store";

interface ErrorStore{
    message: string;
    status: number;
    data: any; 
    timestamp: Date;  
}

function createErrorStore(){
    const {subscribe, set} = writable<ErrorStore | null>(null)

    return {
        subscribe,
        set: (value: Omit<ErrorStore, "timestamp">) => set({...value, timestamp: new Date()}),
        reset: () => set(null),
    }
}

export const errorStore = createErrorStore()

export function getErrorClass(error: ErrorStore) {
    if (error.status >= 500) return 'Server Error';
    if (error.status >= 400) return 'Client Error';
    return 'General Error';
}

export function getErrorMessage(errorMessage:string):string{
    switch (errorMessage) {
        case "INVALID_CREDENTIALS":
            errorMessage = "Invalid email or password"
            break;
        case "USER_ALREADY_EXIST":
            errorMessage = "User already exists"
            break;
        default:
            errorMessage = "An unexpected error occurred"
            break;
    }
    return errorMessage
}