<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import "../styles/chat.css"
    import ChatListSideBar from "../components/ChatListSideBar.svelte";
    import ChatDetails from "../components/ChatDetails.svelte";
    import Header from "../components/Header.svelte";
    
    export let chatId: string | null

    onMount(() => {
        if (!$authToken){
            navigate("/register")
        }
    });
</script>

<div class="h-[calc(100vh-95px)]">
    <Header chatId={chatId}></Header>
    <div class="grid grid-cols-4 h-full ">
       
        <ChatListSideBar chatId={chatId}/>
        
     
            {#if chatId}
                <ChatDetails chatId={chatId}/>
            {/if}
        
    </div>
</div>