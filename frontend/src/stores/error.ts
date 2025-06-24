import { writable } from "svelte/store";

interface ErrorStore{
    message: string;
    status: number;
    data: any; 
    timestamp: Date;  
}

function createLoadingStore(){
    const {subscribe, set} = writable<ErrorStore | null>(null)

    return {
        subscribe,
        set: (value: Omit<ErrorStore, "timestamp">) => set({...value, timestamp: new Date()}),
        reset: () => set(null),
    }
}

export const errorStore = createLoadingStore()
