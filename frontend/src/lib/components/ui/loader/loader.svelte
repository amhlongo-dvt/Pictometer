<script lang="ts">
    import { cn } from "$lib/utils.js";
    import { Loader2 } from "lucide-svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import {isLoading} from "../../../../stores/loading"
    type $$Props = HTMLAttributes<HTMLDivElement>;
    console.log($isLoading)
    let className: $$Props["class"] = undefined;
    export { className as class };
</script>

{#if $isLoading}

    <div class={cn("flex items-center justify-center", className)} {...$$restProps}>
        <Loader2 class="h-10 w-10 animate-spin" />
    </div>
{/if}