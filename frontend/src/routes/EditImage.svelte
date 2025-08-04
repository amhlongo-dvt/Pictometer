<script lang="ts">
    import {onMount} from "svelte"
    import {navigate, useLocation} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import Header from "../components/Header.svelte";
    import ImageCard from "$lib/components/ui/image-card/image-card.svelte";
    import {Slider} from "$lib/components/ui/slider"    
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import { Undo2, Redo2, X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Save } from "lucide-svelte";
    import { getImage, editImage, type ImageTransformations, generateImage } from "../services/imageService";
  import { getChatMessages, getMessage, sendMessage, sendMessageWithImage, updateMessage } from "../services/chatService";
        
    onMount(async () => {
        if (!$authToken){
            navigate("/register")
        }
        
        if(isEditing){
          image = await getMessage(messageId)
          console.log(image);
          
        }else{
          image = await getImage(imageId);
        }

        imageUrl = image.imageUrl;
        isloading = false

        setTimeout(() => {
            hasInitialized = true;
        }, 10000);
    });
    export let imageId:string;  
    export let chatId:string
    const location = useLocation();
    const searchParams = new URLSearchParams($location.search || '');
    const isEditing:boolean = searchParams.get('isEditing') === 'true';
    let messageId:string = searchParams.get('messageId')||""
  
    let isloading = true
    let hasInitialized = false;
    let image;
    let imageUrl:string = "";
    let message: string = "";
    let brightness:number[] = [100];
    let contrast:number[] = [100];
    let saturation:number[] = [100];
    let rotation:number[] = [0];
    let resize:{width: number; height: number} = {width: 0, height: 0};
    let flipHorizontal:boolean = false;
    let flipVertical:boolean = false;
    let isAspect:boolean = false;
    let history:{
        brightness: number;
        contrast: number;
        saturation: number;
        rotation: number;
        flipHorizontal: boolean;
        flipVertical: boolean;
        resize?: {
            width: number;
            height: number;
        };
    }[] = [];
    let redoIndex = 0



    $: transformations = {
            brightness: brightness[0]/100,
            contrast: contrast[0]/100,
            saturation: saturation[0]/100,
            rotation: rotation[0],
            flipHorizontal: flipHorizontal,
            flipVertical: flipVertical,        
            ...(resize.width !==0 && resize.height !== 0
            ? { resize: { width: Number(resize.width), height: Number(resize.height) } }
            : {}),

    }
    $: rotation[0] = rotation[0] % 360;

    async function updateImage() {
        history.push(transformations);
        const response = await editImage(imageId, transformations);
        imageUrl = response.imageUrl;
        imageId = response.imageId;
        console.log(imageUrl);
        
    }


    const debounce = (func: Function, delay = 300): Function => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    const updateImageDebounced = debounce(updateImage);

    $:if (hasInitialized && (brightness || contrast || saturation || rotation || flipHorizontal || flipVertical || resize.width || resize.height)) {
            if(!isloading){
              updateImageDebounced();
            }
        };

    function undo() {
      
      if (redoIndex < history.length - 1) {
          redoIndex++;
          const transformation = history[history.length - redoIndex - 1];
          updateTransforms(transformation);
        }
    }
    function redo() {
        if (redoIndex > 0) {
            redoIndex--;
            const transformation = history[history.length - redoIndex - 1];
            updateTransforms(transformation);
          }
    }

    function clearImage() {
        brightness = [100];
        contrast = [100];
        saturation = [100];
        rotation = [0];
        flipHorizontal = false;
        flipVertical = false;
        resize = {
            width: 0,   
            height: 0
        }
        history = [];
        redoIndex = 0;
    }

  function updateTransforms(transformations: {
    resize?: { width: number; height: number; }
    brightness: number; contrast: number; saturation: number; rotation: number; flipHorizontal: boolean; flipVertical: boolean;
  }) {
    brightness = [transformations.brightness * 100];
    contrast = [transformations.contrast * 100];
    saturation = [transformations.saturation * 100];
    rotation = [transformations.rotation];
    flipHorizontal = transformations.flipHorizontal;
    flipVertical = transformations.flipVertical;
   
    if (transformations.resize) {
        resize = {
            width: transformations.resize.width,
            height: transformations.resize.height
        }
    }
  }

  async function editImageFromPrompt(message: string){
        const response2 = await generateImage(message,imageUrl)
        imageId = response2.imageId;
        imageUrl = response2.imageUrl
  }

  async function saveImage() {
    if(isEditing && messageId){
      await updateMessage(messageId, chatId, imageUrl, imageId)
    }else{
      await sendMessage(chatId, imageUrl, imageId)
    }
    navigate(`/${chatId}`)
  }
</script>
<!-- USE THIS IMAGE URL -->
<div class="flex flex-col h-screen">
    <Header chatId ={chatId}/>
    

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
                <Button variant="noShadow" on:click={undo}>
                  <Undo2 strokeWidth="2.5" /> Undo
                </Button>
                <Button variant="noShadow" on:click={redo}>
                  <Redo2 strokeWidth="2.5"/> Redo
                </Button>
                <Button variant="noShadow" on:click={clearImage}>
                  <X strokeWidth="2.5"/> Clear
                </Button>
              </div>
              <Button variant="noShadow" on:click={saveImage}><Save stroke-width="2.5"/>Save</Button>
            </div>
          </ImageCard>
          <div class="bg-main border-border  p-4 rounded-base border-2 shadow-shadow flex flex-col gap-2 h-full overflow-y-auto scrollbar">
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4">
                      <Label for="prompt">Prompt</Label>
                      <Textarea 
                        bind:value={message}
                        placeholder="Type a prompt to edit your image with AI"
                        class="resize-none" id="prompt" />
                    </div>
                  </Card.Content> 
                  <Card.Footer>
                    <Button on:click={() => {editImageFromPrompt(message)}}>Generate</Button>
                  </Card.Footer>
                </Card.Root>
                
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4">
                      <h1 class="mb-2 font-heading">Adjustments</h1>
                      <Label  for="prompt">Brigthness</Label>
                      <Slider  bind:value={brightness} min={0} max={200} step={1}/>
                      <Label  for="prompt">Contrast</Label>
                      <Slider  bind:value={contrast} min={0} max={200} step={1}/>
                      <Label  for="prompt">Saturation</Label>
                      <Slider  bind:value={saturation} min={0} max={200} step={1}/>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class="space-y-2 pt-4 ">
                      <h1 class="font-heading">Resize</h1>
                      <Button variant="noShadow" class="font-bold" on:click={() => {resize.width = 1024; resize.height = 1024;  isAspect = false}}>1:1</Button>
                      <Button variant="noShadow" class="font-bold" on:click={() => {resize.width = 1920; resize.height = 1080;  isAspect = true}}>16:9</Button>
                      <Button variant="noShadow" class="font-bold" on:click={() => {resize.width = 1920; resize.height = 1440;  isAspect = true}}>4:3</Button>
                    </div>
                  </Card.Content> 
                </Card.Root>
                <Card.Root class="w-full shadow-none">
                  <Card.Content>
                    <div class=" pt-4 flex flex-row justify-between">
                      <div>
                        <h1 class="font-heading">Rotate</h1>
                        <!-- cap rotation to 360 -->

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
   
   
  
 