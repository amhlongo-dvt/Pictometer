<script lang="ts">
    import {navigate} from "svelte-routing"
    import "../styles/header.css"
    import {authToken} from '../stores/auth'
    import DarkMode from "../lib/components/ui/dark-mode/toggle.svelte"
    import * as Avatar from "$lib/components/ui/avatar";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    const name = authToken.getPayload()?.name || "User"
    export let chatId
    function logout() {
        authToken.remove()
        navigate("/login")
    }
</script>

<nav class=" left-0 top-0 z-20 mx-auto flex flex-col w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack ">
   
    <div class="mx-auto h-[88px] flex w-[1340px] dark:text-darkText text-text max-w-full items-center justify-between m500:h-16 px-5">
        <div class="flex items-center gap-10">
            <a 
                class="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black m500:w-9 m500:h-9 m500:text-[22px] items-center justify-center font-heading" 
                tabindex="0"
                role="button"
                on:click={() => {navigate(`/${chatId}`)}}
                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ')}
                href={undefined}
            >
                P
            </a>        
        </div>

        <div class="flex items-center gap-5 m1000:gap-5">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger >
                    <Avatar.Root>
                        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                        <Avatar.Fallback>{name[0]}</Avatar.Fallback>
                    </Avatar.Root>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content >
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                        <DropdownMenu.Item>
                            <span>Change Profile Image</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item on:click={logout}>
                            <span class=" text-red-600">Logout</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
                
        <div class="flex items-center justify-end gap-5 m800:w-[unset] m400:gap-3">
            <DarkMode/>
        </div>
    </div>
    </div>

</nav>