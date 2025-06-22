import axios from "axios";
import { API_HOST } from "../constants";
import { loadingStore } from "../stores/loading";

const api = axios.create({
    baseURL: `${API_HOST}`,
    timeout: 100000
})

api.interceptors.request.use(
    config => {
        loadingStore.increment()
        return config
    },

    error => {
        loadingStore.decrement()
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        loadingStore.decrement()
        return response
    },

    error => {
        loadingStore.decrement()
        return Promise.reject(error)
    }
)

export default api