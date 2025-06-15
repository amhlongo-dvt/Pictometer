<script lang="ts">
    import {onMount} from "svelte"
    import "../styles/chatDetails.css"
    import { deleteMessage, getChatMessages, sendMessage as sendChatMessage, type Message } from "../services/chatService"
    import ImageCard from "../lib/components/ui/image-card/image-card.svelte";
    import {Button} from "../lib/components/ui/button"
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { navigate } from "svelte-routing";
    import { getImage } from "../services/imageService";
    import { API_HOST } from "../constants";

    export let chatId: string;

    let images: Message[] = [];
    let newMessage = "";
    let errorMessage: string | null = null;
    let isLoading = false;
    let isOpen = false;

    let imageName:string = "";
    let imageDate: Date = new Date(Date.now());
    let imageSize:string = "1.9Mb"
    let imageUrl:string = "";
    let imageId:string = "";
    let messageId:string = "";
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



    async function openSheet(imageIdArg:string, id: string){
        isOpen = true
        console.log(imageIdArg)
        const res = await getImage(imageIdArg)
        imageName = res.metadata.filename
        imageDate = new Date(res.createdAt)
        console.log(res.createdAt);
        messageId = id;
        
        imageUrl = res.imageUrl
        
        imageSize = `${(res.metadata.size/1024).toFixed(2)} Kb`
        imageId = res.imageId
    }
    async function deleteImage(id:string){
       await deleteMessage(id)
       isOpen=false
       navigate(`/${chatId}`)
       loadMessages()
    //    location.reload()
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
            <button class="aspect-w-1 aspect-h-1 transition-all" on:click={()=>{openSheet(image.imageId, image.id)}}>
                <ImageCard class="w-full h-auto object-cover rounded text-left hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none" imageUrl={image.imageUrl} caption={image.imageUrl} isAspect={true} />
            </button>
        {/each}
    </div>
    <Sheet.Root bind:open={isOpen}>
        
        <Sheet.Content class="space-y-2 overflow-y-auto scrollbar">
            <ImageCard class="w-full h-auto object-cover rounded text-left shadow-none mt-6" imageUrl={imageUrl} caption="Hello" isCaptionVisible={false} shadowVisible={false} />
                
            
                <Card.Root class="w-full shadow-sm">
                    <Card.Content>
                    <div class="space-y-2 pt-4 flex flex-col">
                        <Label >Name</Label>
                        <Sheet.Description>{imageName}</Sheet.Description>
                        <Label>Size</Label>
                        <Sheet.Description>{imageSize}</Sheet.Description>
                        <Label>Date</Label>
                        <Sheet.Description>{imageDate}</Sheet.Description>
                        
                    </div>
                    </Card.Content> 
                    
                </Card.Root>
                
                    <div class="space-y-2 pt-4 flex flex-col">
                        <Button class="w-full" on:click={() => {navigate(`/edit/${chatId}/${imageId}`)}}>Edit</Button>
                        <a href={`${API_HOST}/api/v1/image/download/${imageId}`}>
                            <Button class="w-full">Download</Button>
                        </a>
                        <Button class="w-full" variant="neutral" on:click={() => {deleteImage(messageId)}}>Delete</Button>
                        
                    </div>
            
        </Sheet.Content>
      </Sheet.Root>
</div>
