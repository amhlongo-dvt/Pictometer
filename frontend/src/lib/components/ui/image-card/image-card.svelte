<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import {Loader} from "$lib/components/ui/loader/index.js";
	 import {isLoading} from "../../../../stores/loading"

	interface $$Props extends HTMLAttributes<HTMLElement> {
		imageUrl: string;
		caption: string;
		isCaptionVisible?: boolean;
		class?: string;
		rounded?: boolean;
		shadowVisible?: boolean;
		isAspect?: boolean;
		previewFilter?: string;
		aspectClass?: string;
		}
	export let imageUrl: string;
	export let caption: string;
	export let isCaptionVisible: boolean = true;
	export let rounded: boolean = false;
	export let shadowVisible: boolean = true;
	export let isAspect: boolean = false;
	export let previewFilter: string = "";
	export let aspectClass: string = "aspect-[4/3]";

	

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<figure
	class={cn(
		"w-full h-full  overflow-hidden rounded-base border-2 border-border bg-main font-base  flex flex-col",
		shadowVisible ? "shadow-shadow" : "",
		className
	)}
	{...$$restProps}
	
>
		<div class="flex-shrink-0">
		<slot name="top" />
	</div>
	{#if !$isLoading}	
		<img 
	
			class="w-full flex-1  {isAspect ? aspectClass : "min-h-0"} {rounded ? "rounded-base" : ""} object-fill" 
			style={ previewFilter}
			src={imageUrl} 
			alt={caption} 
		/>
	{/if}
	<Loader class="w-full flex-1  {isAspect ? aspectClass : "min-h-0"} {rounded ? "rounded-base" : ""} object-fill" />
	{#if isCaptionVisible}
		<figcaption class="border-t-2 text-sm border-border p-4 flex-shrink-0 line-clamp-1 ">
			{caption}
		</figcaption>
	{/if}
</figure>