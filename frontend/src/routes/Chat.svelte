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

<div>
    <Header></Header>
    <!-- make this div a grid with 2 columns and the make the div not scrollable-->
    <div class="grid grid-cols-4 h-[calc(100vh-6vh)]">
       
        <ChatListSideBar chatId={chatId}/>
        
     
            {#if chatId}
                <ChatDetails chatId={chatId}/>
            {/if}
        
    </div>
</div>