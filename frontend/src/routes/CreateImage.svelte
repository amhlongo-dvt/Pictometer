<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import {authToken} from "../stores/auth"
    import Header from "../components/Header.svelte";
    import ImageCard from "$lib/components/ui/image-card/image-card.svelte";
        
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
    
         
          <div class="bg-main border-border  p-4 rounded-base border-2 shadow-shadow ">
            <p>Other content here (e.g., controls, info)</p>
          </div>
        </div>
      </div>
</div>
   
   
  
 