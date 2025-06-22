<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import Header from "../components/Header.svelte";
    import ImageCard from "$lib/components/ui/image-card/image-card.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import {Loader} from "$lib/components/ui/loader/index.js";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import {getChatMessages, sendMessage} from "../services/chatService"
    import { createImage, generateImage } from "../services/imageService";

    onMount(() => {
      if (!$authToken){
          navigate("/register")
        }
    });
    export let chatId:string;
    let message = ""
    let imageUrl = ""
    let file: File | null = null;
    let isGenerated = false;
    let imageId: string;
    let fileName:string = "";
    const reader = new FileReader();

    async function generateImageFromPrompt(message: string){
        
        // const response = await getChatMessages("0");
        
        const response2 = await generateImage(message)
        imageId = response2.imageId;
        imageUrl = response2.imageUrl
        fileName = response2.metadata.filename
        isGenerated = true;
        
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        file = target.files![0];
        if (file) {
            reader.onload = (e) => {
                const result = e.target?.result as string;
                imageUrl = result;
            };
            reader.readAsDataURL(file);
            fileName  = file.name
        }
    }

    async function createImageFile(){
      if(!isGenerated && file){
        const response = await createImage(file);
        imageId = response.imageId;
      }
      navigate(`/edit/${chatId}/${imageId}`);
    }

    function clearImage(){
        imageUrl = ""
        imageId = ""
        reader.abort();
        file = null;
    }
</script>

<div class="flex flex-col h-screen">
    <Header chatId = {chatId}/>
    

    <div class="flex-1 min-h-0  p-4">
       
        <div class="grid grid-cols-4 gap-4 h-full">
         
          <ImageCard
            class="col-span-3 w-full"
            imageUrl={imageUrl}
            caption={fileName? `${fileName}` : ""}
          />

         
          <div class="bg-main border-border  p-4 rounded-base border-2 shadow-shadow flex flex-col justify-between h-full">
            <Tabs.Root value="upload" class="">
              <Tabs.List class="grid w-full grid-cols-2">
                <Tabs.Trigger value="upload">Upload</Tabs.Trigger>
                <Tabs.Trigger value="generate">Generate</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="upload">
                <Card.Root>
                  <Card.Header>
                    <Card.Title>Upload</Card.Title>
                    <Card.Description>
                      Upload your image here. Click save when you're done.
                    </Card.Description>
                  </Card.Header>
                  <Card.Content class="space-y-2">
                    <div class="space-y-2">
                      <Label for="file">File</Label>
                      <Input type="file" id="file" on:change={handleFileChange} />
                    </div>
                  </Card.Content>
                  <Card.Footer>
                    <Button variant="noShadow" class="w-full" on:click={() => {clearImage()}}>Clear</Button>
                  </Card.Footer>
                </Card.Root>
              </Tabs.Content>
              <Tabs.Content value="generate">
                <Card.Root class="w-full">
                  <Card.Header>
                    <Card.Title>Generate</Card.Title>
                    <Card.Description>
                      Generate your image here. Click save when you're done.
                    </Card.Description>
                  </Card.Header>
                  <Card.Content class="space-y-2">
                    <div class="space-y-2">
                      <Label for="prompt">Prompt</Label>
                      <Textarea 
                        placeholder="Type a prompt to generate an image"
                        class="resize-none" id="prompt" 
                        bind:value={message}
                        />
                    </div>
                  </Card.Content> 
                  <Card.Footer>
                    <Button variant="noShadow"  on:click={() => {generateImageFromPrompt(message)}}>Generate</Button>
                  </Card.Footer>
                </Card.Root>
              </Tabs.Content>
            </Tabs.Root>
            <Button class="w-full" variant="noShadow" on:click={() => createImageFile()}>Create</Button>
          </div>


        </div>
      </div>
</div>
   
   
  
 