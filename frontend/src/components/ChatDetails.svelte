<script lang="ts">
    import {onMount} from "svelte"
    import axios from "axios";
    import "../styles/chatDetails.css"
    import { getChatMessages, sendMessage as sendChatMessage } from "../services/chatService"
    
    export let chatId: string;

    let messages: {message: string, createdAt: number}[] = [];
    let newMessage = "";
    let errorMessage: string | null = null;
    let isLoading = false;


    onMount(async () => {
        await loadMessages()
    })
    async function loadMessages() {
        try {
            const response = await getChatMessages(chatId);
            messages = response.chats;
        } catch (error) {
            errorMessage = "Failed to get chat details. Please try again later";
            console.error('Error fetching messages', error)
        } 
    }

    async function sendMessage() {
        isLoading = true;
        try {
            await sendChatMessage(chatId, newMessage);
            messages = [...messages, {message: newMessage, createdAt: Date.now()}];
            newMessage = "";
            await loadMessages()
        } catch (error) {
            errorMessage = "Failed to send message. Please try again later";
            console.error('Error sending message', error)
        } finally {
            isLoading = false;
        }
    }

    $: {
        if (chatId) {
            loadMessages()
        }
    }
</script>

<div class="chat-details-wrapper"> 
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <ul>
        {#each messages as message}
            <li>
                {message.message}
                <span>{new Date(message.createdAt).toLocaleString()}</span>
            </li>
        {/each}
    </ul>
    <textarea bind:value={newMessage} placeholder="Type a message"></textarea>
    <button on:click={sendMessage} disabled={isLoading}>
        {#if isLoading}
            Sending...
        {:else}
            Send
        {/if}
    </button>
</div>