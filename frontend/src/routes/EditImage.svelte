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
    import { Undo2, Redo2, X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-svelte";
  import { getImage } from "../services/imageService";
        
    onMount(async () => {
        if (!$authToken){
            navigate("/register")
        }
        image = await getImage(imageId);
        imageUrl = image.imageUrl;
        console.log(image)
    });
    export let imageId:string;  

    let image;
    let imageUrl:string = "";
    let brightness = [100];
    let contrast = [100];
    let saturation = [100];
    let rotation = [0];
    let crop = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
    let flipHorizontal = false;
    let flipVertical = false;
    $: previewFilter = ` 
    filter: brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%); 
    transform: rotate(${rotation[0]}deg) ${flipHorizontal ? "scaleX(-1)" : ""} ${flipVertical ? "scaleY(-1)" : ""};`;

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
              previewFilter={previewFilter}
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
                      <Slider  bind:value={brightness}  max={200} step={1}/>
                      <Label  for="prompt">Contrast</Label>
                      <Slider  bind:value={contrast}  max={200} step={1}/>
                      <Label  for="prompt">Saturation</Label>
                      <Slider  bind:value={saturation}  max={200} step={1}/>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4 ">
                      <h1 class="font-heading">Crop</h1>
                      <Button variant="noShadow" class="font-bold" on:click={() => {crop.x = 0; crop.y = 0; crop.width = 0; crop.height = 0}}>1:1</Button>
                      <Button variant="noShadow" class="font-bold" on:click={() => {crop.x = 0; crop.y = 0; crop.width = 0; crop.height = 0}}>4:3</Button>
                      <Button variant="noShadow" class="font-bold" on:click={() => {crop.x = 0; crop.y = 0; crop.width = 0; crop.height = 0}}>16:9</Button>
                      <Button variant="noShadow" class="font-bold" on:click={() => {crop.x = 0; crop.y = 0; crop.width = 0; crop.height = 0}}>Free</Button>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class=" pt-4 flex flex-row justify-between">
                      <div>
                        <h1 class="font-heading">Rotate</h1>
                        <Button variant="noShadow" on:click={() => rotation[0] -= 90}><RotateCcw strokeWidth="3"/></Button>
                        <Button variant="noShadow" on:click={() => rotation[0] += 90}><RotateCw strokeWidth="3"/></Button>
                      </div>
                      <div>
                        <h1 class="font-heading">Flip</h1>
                        <Button variant="noShadow" on:click={() => flipHorizontal = !flipHorizontal}><FlipHorizontal strokeWidth="3"/></Button>
                        <Button variant="noShadow" on:click={() => flipVertical = !flipVertical}><FlipVertical strokeWidth="3"/></Button>
                      </div>
                    </div>
                  </Card.Content> 
                </Card.Root>

          </div>


        </div>
      </div>
</div>
   
   
  
 