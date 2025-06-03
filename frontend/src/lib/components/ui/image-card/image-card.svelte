<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	interface $$Props extends HTMLAttributes<HTMLElement> {
		imageUrl: string;
		caption: string;
		isCaptionVisible?: boolean;
		class?: string;
		rounded?: boolean;
	}

	export let imageUrl: string;
	export let caption: string;
	export let isCaptionVisible: boolean = true;
	export let rounded: boolean = false;
	
	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<figure
	class={cn(
		"w-full h-full overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow flex flex-col",
		className
	)}
	{...$$restProps}
	
>
		<div class="flex-shrink-0">
		<slot name="top" />
	</div>
	<img 
		class="w-full flex-1 min-h-0 {rounded ? "rounded-base" : ""}" 
		src={imageUrl} 
		alt={caption} 
	/>
	{#if isCaptionVisible}
	<figcaption class="border-t-2 text-mtext border-border p-4 flex-shrink-0">
		{caption}
	</figcaption>
{/if}
</figure>