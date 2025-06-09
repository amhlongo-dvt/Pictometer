<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import Header from "../components/Header.svelte";
    import ImageCard from "$lib/components/ui/image-card/image-card.svelte";
    import {Slider} from "$lib/components/ui/slider"    
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import { Undo2, Redo2, X, RotateCw, RotateCcw } from "lucide-svelte";
  import { getImage } from "../services/imageService";
        
    onMount(() => {
        if (!$authToken){
            navigate("/register")
        }
    });
    export let imageId:string;

    let image;
    let imageUrl:string = "";
  
    onMount(async () => {
        image = await getImage(imageId);
        imageUrl = image.imageUrl;
        console.log(image)
    })
</script>
<!-- USE THIS IMAGE URL -->
<div class="flex flex-col h-screen">
    <Header/>
    

    <div class="flex-1 min-h-0  p-4">
       
        <div class="grid grid-cols-4 gap-4 h-full">
         
            
            <ImageCard
              class="col-span-3 w-full p-4 bg-bw"
              imageUrl={imageUrl}
              caption="Image caption"
              isCaptionVisible={false}
              rounded={true}
            >
            <div slot="top" class="py-4 w-full flex flex-row justify-between gap-2">
              <div class="pr-0 flex flex-row justify-end gap-1">
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
              <Button variant="noShadow">Save</Button>
            </div>
          </ImageCard>
         
          <div class="bg-main border-border  p-4 rounded-base border-2 shadow-shadow flex flex-col gap-2 h-full overflow-y-auto scrollbar">
                <Card.Root class="w-full shadow-none">
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
                
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4">
                      <h1 class="mb-2 font-heading">Adjustments</h1>
                      <Label  for="prompt">Brigthness</Label>
                      <Slider  max={100} step={1}/>
                      <Label  for="prompt">Contrast</Label>
                      <Slider  max={100} step={1}/>
                      <Label  for="prompt">Saturation</Label>
                      <Slider  max={100} step={1}/>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4 ">
                      <h1 class="font-heading">Crop</h1>
                      <Button variant="noShadow" class="font-bold">1:1</Button>
                      <Button variant="noShadow" class="font-bold">16:9</Button>
                      <Button variant="noShadow" class="font-bold">Free</Button>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4">
                      <h1 class="font-heading">Rotate</h1>
                      <Button variant="noShadow"><RotateCcw strokeWidth="3"/></Button>
                      <Button variant="noShadow"><RotateCw strokeWidth="3"/></Button>
                    </div>
                  </Card.Content> 
                </Card.Root>

          </div>


        </div>
      </div>
</div>
   
   
  
 