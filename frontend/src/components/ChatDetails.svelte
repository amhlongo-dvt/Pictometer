<script lang="ts">
    import {onMount} from "svelte"
    import axios from "axios";
    import "../styles/chatDetails.css"
    import { getChatMessages, sendMessage as sendChatMessage } from "../services/chatService"
    import ImageCard from "../lib/components/ui/image-card/image-card.svelte";
    
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

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-3 overflow-y-auto p-4"> 

    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="Hello" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="" />
    </div>
    <div class="aspect-w-1 aspect-h-1">
        <ImageCard class="w-full h-auto object-cover rounded" imageUrl="" caption="" />
    </div>

</div>