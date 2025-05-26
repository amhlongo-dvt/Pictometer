<script lang="ts">
    import axios from "axios";
    import {API_HOST} from "../constants"
    
    export let onCreate: (newChatId: string) => void
    export let onClose: () => void

    let chatName = '';
    let errorMessage: string | null = null;

    $: formValid = chatName.length > 0;

    async function createChat() {
        try {
            const response = await axios.post(`${API_HOST}/api/v1/chat/`, {
                name: chatName,
            });
            onCreate(response.data.id);
        } catch (error) {
            console.error('Error creating chat', error)
            errorMessage = "Failed to created chat. Please try again later";
        }
    }
</script>

<div class="popup">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="close-button" on:click={onClose}>X</div>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
    <input type="text" bind:value={chatName} placeholder="Enter chat name"/>
    <button disabled={!chatName.length} on:click={createChat}>Create</button>
</div>