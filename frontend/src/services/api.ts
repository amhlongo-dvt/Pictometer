import axios, { Axios } from "axios";
import { API_HOST } from "../constants";
import { loadingStore } from "../stores/loading";
import { errorStore } from "../stores/error";

const api:Axios = axios.create({
    baseURL: `${API_HOST}`,
    timeout: 100000
})

api.interceptors.request.use(
    config => {
        loadingStore.increment()
        errorStore.reset()
        return config
    },

    error => {
        loadingStore.decrement()
        errorStore.set({
            message: error.response?.data.error || "null",
            status: error.response?.status || 500,
            data: error.response?.data || null,
        })
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        loadingStore.decrement()
        errorStore.reset()
        return response
    },

    error => {
        loadingStore.decrement()
        errorStore.set({
            message: error.response?.data.error || "null",
            status: error.response?.status || 500,
            data: error.response?.data || null,
        })
        return Promise.reject(error)
    }
)

export default api