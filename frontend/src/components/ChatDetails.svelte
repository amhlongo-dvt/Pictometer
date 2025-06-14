<script lang="ts">
    import {onMount} from "svelte"
    import "../styles/chatDetails.css"
    import { getChatMessages, sendMessage as sendChatMessage, type Message } from "../services/chatService"
    import ImageCard from "../lib/components/ui/image-card/image-card.svelte";
    import {Button} from "../lib/components/ui/button"
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
  import { navigate } from "svelte-routing";

    export let chatId: string;

    let images: Message[] = [];
    let newMessage = "";
    let errorMessage: string | null = null;
    let isLoading = false;
    let isOpen = false;

    let imageName:string;
    let imageDate: Date;
    let imageSize:string = "1.9Mb"
    let imageId:string;
    let imageUrl:string;
    onMount(async () => {
        await loadMessages()
    })

    async function loadMessages() {
        try {
            const response = await getChatMessages(chatId);
            images = response.chats
        } catch (error) {
            errorMessage = "Failed to get chat details. Please try again later";
            console.error('Error fetching messages', error)
        } 
    }



    async function openSheet(imageId:string){
        isOpen = true
        console.log(imageId)
    }

    $: {
        if (chatId) {
            loadMessages()
        }
    }
</script>
<div class="col-span-3 overflow-y-auto scrollbar">
    <Button variant="noShadow" class="w-full rounded-none border-b-4  border-l-0  border-r-0" on:click={()=>{navigate(`/create/${chatId}`)}}>New Image</Button>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-3  p-4"> 
        {#each images as image}
            <button class="aspect-w-1 aspect-h-1 transition-all" on:click={()=>{openSheet(image.imageId)}}>
                <ImageCard class="w-full h-auto object-cover rounded text-left hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none" imageUrl={image.imageUrl} caption={image.imageUrl} isAspect={true} />
            </button>
        {/each}
    </div>
    <Sheet.Root bind:open={isOpen}>
        
        <Sheet.Content class="space-y-2 ">
            <ImageCard class="w-full h-auto object-cover rounded text-left shadow-none mt-6" imageUrl="" caption="Hello" isCaptionVisible={false} shadowVisible={false} />
                
            
                <Card.Root class="w-full shadow-sm">
                    <Card.Content>
                    <div class="space-y-2 pt-4 flex flex-col">
                        <Label >Name</Label>
                        <Sheet.Description>Landscape artist</Sheet.Description>
                        <Label>Size</Label>
                        <Sheet.Description>1.9 MB</Sheet.Description>
                        <Label>Date</Label>
                        <Sheet.Description>19/04/2021</Sheet.Description>
                        
                    </div>
                    </Card.Content> 
                    
                </Card.Root>
                
                    <div class="space-y-2 pt-4 flex flex-col">
                        <Button class="w-full">Edit</Button>
                        <Button class="w-full">Download</Button>
                        <Button class="w-full" variant="neutral">Delete</Button>
                        
                    </div>
            
        </Sheet.Content>
      </Sheet.Root>
</div>
