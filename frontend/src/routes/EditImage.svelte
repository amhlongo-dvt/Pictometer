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
    import { Undo2, Redo2, X } from "lucide-svelte";
        
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
              class="col-span-3 w-full p-4 bg-bw"
              imageUrl="https://picsum.photos/seed/picsum123/800/600"
              caption="Image caption"
              isCaptionVisible={false}
              rounded={true}
            >
            <div slot="top" class="p-4 pr-0 w-full flex flex-row justify-end gap-2">
              <Button variant="noShadow">
                <Undo2 strokeWidth="2.5"/> Undo
              </Button>
              <Button variant="noShadow">
                <Redo2 strokeWidth="2.5"/> Redo
              </Button>
              <Button variant="noShadow">
                <X strokeWidth="2.5"/> Clear
              </Button>
            </div>
          </ImageCard>
         
          <div class="bg-main border-border  p-4 rounded-base border-2 shadow-shadow flex flex-col justify-between h-full">
                <Card.Root class="w-full">
                  <Card.Content>
                    <div class="space-y-2 pt-4">
                      <Label for="prompt">Prompt</Label>
                      <Textarea 
                        placeholder="Type a prompt to edit your image with AI"
                        class="resize-none" id="prompt" />
                    </div>
                  </Card.Content> 
                  <Card.Footer>
                    <Button>Generate</Button>
                  </Card.Footer>
                </Card.Root>
          </div>


        </div>
      </div>
</div>
   
   
  
 