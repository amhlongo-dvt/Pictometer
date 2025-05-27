<script lang="ts">
    import {onMount} from "svelte"
    import axios from "axios";
    import "../styles/chatList.css"
    import {navigate} from "svelte-routing"
    import CreateChatPopup from "./CreateChatPopup.svelte";
    import {API_HOST} from "../constants"
    
    let chats: {id: string, name: string}[] = [];
    let errorMessage: string | null = null;
    
    export let chatId: string | null;

    async function getdata(){
        try {
            const response = await axios.get(`${API_HOST}/api/v1/chat/`);
            chats = response.data.data;
        } catch (error) {
            console.error('Error fetching chats', error)
            errorMessage = "Failed to fetch chats. Please try again later";
        }
    } 


    onMount(async () => {
        await getdata();
    })

    let isCreatingNewChat = false;

    function selectChat(chatId: string) {
        navigate(`/${chatId}`)
    }
    

    function createNewChat() {
        isCreatingNewChat = true;
    }

    async function onClose() {
        isCreatingNewChat = false;
    }

    async function onCreateChat(chatId: string) {
        await getdata();
        selectChat(chatId);
        onClose();
    }
</script>

<div class="chat-list-container">
    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
    
    {#if isCreatingNewChat}
        <CreateChatPopup
            onCreate={onCreateChat}
            onClose={onClose}
        />
    {/if}

    {#if chats.length === 0}
        <div class="no-chats">
            No chats available. Create a new one!
        </div>
    {/if}

    <ul class="chat-list">
        {#each chats as chat (chat.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <li 
                class="chat-list-item" 
                class:selected={chat.id === chatId}
                on:click={() => selectChat(chat.id)}
            >
                {chat.name}
            </li>
        {/each}
    </ul>    
    <button on:click={createNewChat}>New Chat</button>
</div>