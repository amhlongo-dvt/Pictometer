<script lang="ts">
    import {onMount} from "svelte"
    import "../styles/chatList.css"
    import {navigate} from "svelte-routing"
    import CreateChatPopup from "./CreateChatPopup.svelte";
    import { getChatList } from "../services/chatService"
    import {Button} from "../lib/components/ui/button"

    let chats: {id: string, name: string}[] = [];
    let errorMessage: string | null = null;
    
    export let chatId: string | null;

    async function getdata(){
        try {
            const response = await getChatList();
            chats = response.data;
        } catch (error) {
            console.error('Error fetching chats', error)
            errorMessage = "Failed to fetch chats. Please try again later";
        }
    } 


    onMount(async () => {
        await getdata();
    })

    let isCreatingNewChat = false;

    $: console.log('count changed:', isCreatingNewChat);

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


<aside class="scrollbar bg-white dark:bg-secondaryBlack h-full col-span-1 flex flex-col overflow-x-hidden border-r-4 border-border dark:border-darkNavBorder">
    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
    
    {#if isCreatingNewChat}
        <CreateChatPopup
            onCreate={onCreateChat}
            onClose={onClose}
            isOpen={isCreatingNewChat}
        />
    {/if}

    {#if chats.length === 0}

        <div class="text-center p-4">
            No collections available. Create a new one!
        </div>
    {/if}

    <ul class="flex flex-col flex-1 overflow-y-auto scrollbar">
        {#each chats as chat (chat.id)}
        <button 
        class="block border-b-4 w-full text-left border-border dark:border-darkNavBorder p-4 pl-7 text-lg font-base text-text/90 dark:text-darkText/90 hover:bg-main dark:hover:text-text" 
        class:selected={chat.id === chatId}
        on:click={() => selectChat(chat.id)}
        >
        {chat.name}
    </button>
    {/each}
    </ul>    
    <Button variant="noShadow" class="w-full rounded-none border-b-4 border-l-0 border-r-0" on:click={() => (isCreatingNewChat = true)}>New Collection</Button>
    
</aside>


