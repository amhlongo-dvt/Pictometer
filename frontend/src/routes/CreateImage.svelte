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
        
    onMount(() => {
        if (!$authToken){
            navigate("/register")
        }
    });
</script>

<div class="flex flex-col h-screen">
    <Header/>
    

    <div class="flex-1 min-h-0  p-4">
       
        <div class="grid grid-cols-4 gap-4 h-full">
         
          <ImageCard
            class="col-span-3 w-full"
            imageUrl="https://picsum.photos/seed/picsum123/800/600"
            caption="Image caption"
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
                      <Input type="file" id="file" />
                    </div>
                  </Card.Content>
                  <Card.Footer>
                    <Button>Clear</Button>
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
                        class="resize-none" id="prompt" />
                    </div>
                  </Card.Content> 
                  <Card.Footer>
                    <Button>Generate</Button>
                  </Card.Footer>
                </Card.Root>
              </Tabs.Content>
            </Tabs.Root>
            <Button class="w-full">Edit</Button>
          </div>


        </div>
      </div>
</div>
   
   
  
 