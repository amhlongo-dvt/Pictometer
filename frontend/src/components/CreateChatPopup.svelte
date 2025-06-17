<script lang="ts">
    import axios from "axios";
    import "../styles/chatPopup.css"
    import { createChat } from "../services/chatService"
    import {
    Button,
    buttonVariants
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
    
    export let onCreate: (newChatId: string) => void
    export let onClose: () => void
    export let isOpen:boolean
    let chatName = '';
    let errorMessage: string | null = null;

    $: formValid = chatName.length > 0;

    async function handleCreateChat() {
        try {
            const response = await createChat(chatName);
            onCreate(response.chat.id);
        } catch (error) {
            console.error('Error creating chat', error)
            errorMessage = "Failed to create chat. Please try again later";
        }
    }
</script>



<Dialog.Root bind:open={isOpen} onOpenChange={onClose}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Create Collection</Dialog.Title>
        <Dialog.Description>
          Create your colllection to save all you images into one place
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" bind:value={chatName}  class="col-span-3" />
        </div>
      </div>
      <Dialog.Footer>
        <Button type="submit" disabled={!chatName.length} on:click={handleCreateChat}>Add collection</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
  