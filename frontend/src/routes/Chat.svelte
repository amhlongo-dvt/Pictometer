<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import "../styles/chat.css"
    import ChatListSideBar from "../components/ChatListSideBar.svelte";
    import ChatDetails from "../components/ChatDetails.svelte";
    import Header from "../components/Header.svelte";
    import {DotLottieSvelte} from "@lottiefiles/dotlottie-svelte";
    import dataAnimation from "../assets/data.lottie?url";
    
    export let chatId: string | null

    onMount(() => {
        if (!$authToken){
            navigate("/register")
        }
    });
</script>

<div class="h-[calc(100vh-93px)]">
    <Header chatId={chatId}></Header>
    <div class="grid grid-cols-4 h-full ">
       
        <ChatListSideBar chatId={chatId}/>
        
     
            {#if chatId}
                <ChatDetails chatId={chatId}/>
            {/if}
            {#if !chatId}
            <figure class="col-span-3 h-2/3 ">
            <figcaption class="border-t-2  border-border p-4 flex-shrink-0 line-clamp-1 text-center items-center text-text text-md font-bold">
                Please select a collection or create a new one
            </figcaption>
                <DotLottieSvelte
                    speed={1.5}
                    src={dataAnimation}
                    loop
                    autoplay
                    mode="reverse-bounce"
              />
            </figure>
            {/if}
        
    </div>
</div>