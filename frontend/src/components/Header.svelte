<script lang="ts">
    import {navigate} from "svelte-routing"
    import "../styles/header.css"
    import {authToken} from '../stores/auth'
    import Button from "../lib/components/ui/dark-mode/toggle.svelte"
    const name = authToken.getPayload()?.name || "User"
   
    function logout() {
        authToken.remove()
        navigate("/login")
    }
</script>

<!-- <div class="header">
    <div class="user-name">{name}</div>
    <button class="logout-button" on:click={logout}>
        Logout
    </button>
</div> -->

<nav class=" left-0 top-0 z-20 mx-auto flex flex-col w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack ">
   
    <div class="mx-auto h-[88px] flex w-[1340px] dark:text-darkText text-text max-w-full items-center justify-between m500:h-16 px-5">
        <div class="hidden w-[236px] m900:block m800:w-[108px] m400:w-9">
            <button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R31la:" data-state="closed" class="flex items-center justify-center rounded-base border-2 border-border dark:border-darkBorder p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu h-6 w-6 m500:h-4 m500:w-4"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="flex items-center gap-10">
            <a class="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black m500:w-9 m500:h-9 m500:text-[22px] items-center justify-center font-heading" href="/">
                P
            </a>
        
    </div>
    <div class="flex items-center gap-5 m1000:gap-5">
        
        <div class="flex items-center justify-end gap-5 m800:w-[unset] m400:gap-3">
            
            <Button/>
        </div>
    </div>

</nav>