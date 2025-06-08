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
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import {getChatMessages, sendMessage} from "../services/chatService"
  onMount(() => {
        if (!$authToken){
            navigate("/register")
          }
        });
        let message = ""
        let imageUrl = ""
        async function generateImage(message: string){
            await sendMessage("0", message)
            const response = await getChatMessages("0");
            imageUrl = response.chats[response.chats.length - 1].message;
        }
        const reader = new FileReader();
        let file: File | undefined = undefined;

        function handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement;
            file = target.files?.[0];
            if (file) {
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    imageUrl = result;
                };
                reader.readAsDataURL(file);
            }
        }

        function clearImage(){
            imageUrl = ""
            file = undefined;
            reader.abort();
        }
</script>

<div class="flex flex-col h-screen">
    <Header/>
    

    <div class="flex-1 min-h-0  p-4">
       
        <div class="grid grid-cols-4 gap-4 h-full">
         
          <ImageCard
            class="col-span-3 w-full"
            imageUrl={imageUrl}
            caption={file? `${file?.name}` : ""}
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
                    <Button variant="noShadow"  on:click={() => {generateImage(message)}}>Generate</Button>
                  </Card.Footer>
                </Card.Root>
              </Tabs.Content>
            </Tabs.Root>
            <Button class="w-full">Edit</Button>
          </div>


        </div>
      </div>
</div>
   
   
  
 