import { writable } from "svelte/store";

function createLoadingStore(){
    const {subscribe, set, update} = writable(0)

    return {
        subscribe,
        increment: () => update(n => n + 1),
        decrement: () => update(n => Math.max(0, n-1)),
        reset: () => set(0)
    }
}

export const loadingStore = createLoadingStore()

import {derived} from 'svelte/store'
export const isLoading = derived(loadingStore, $count => $count > 0)