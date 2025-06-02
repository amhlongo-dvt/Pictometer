<script lang="ts">
    import axios from "axios";
    import "../styles/chatPopup.css"
    import { createChat } from "../services/chatService"
    
    
    export let onCreate: (newChatId: string) => void
    export let onClose: () => void

    let chatName = '';
    let errorMessage: string | null = null;

    $: formValid = chatName.length > 0;

    async function handleCreateChat() {
        try {
            const response = await createChat(chatName);
            onCreate(response.chat.id);
        } catch (error) {
            console.error('Error creating chat', error)
            errorMessage = "Failed to create chat. Please try again later";
        }
    }
</script>

<!-- add an overlay below the popup and make the popup disappar if clicked -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay" on:click={onClose} aria-label="Close"></div>
<div class="popup">
    <button class="close-button" on:click={onClose} aria-label="Close">X</button>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
    <input type="text" bind:value={chatName} placeholder="Enter chat name"/>
    <button disabled={!chatName.length} on:click={handleCreateChat}>Create</button>
</div>