import { writable } from "svelte/store";
import {jwtDecode} from "jwt-decode";
import api from "../services/api"

interface TokenPayLoad{
    name: string
}



function setAxiosAuth(token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

function createAuthStore() {
    const token = localStorage.getItem("authToken");
    if (token) {
        setAxiosAuth(token)
    }

    

    const {subscribe, set} = writable<string | null>(token)

    return{
        subscribe,
        set: (value: string) => {
            localStorage.setItem("authToken", value);
            set(value)
            if (value){
                setAxiosAuth(value)
            }else{
                delete  api.defaults.headers.common["Authorization"];
            }
        },
        remove: () => {
            localStorage.removeItem("authToken");
            set(null);
            delete  api.defaults.headers.common["Authorization"];
        },
        getPayload: () => {
            const token = localStorage.getItem("authToken");
            if(token) {
                const decoded: TokenPayLoad = jwtDecode(token)
                return decoded
            }   
            return null
        },
    };
}

export const authToken = createAuthStore()