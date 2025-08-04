<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = TabsPrimitive.TriggerProps;
	type $$Events = TabsPrimitive.TriggerEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"];
	export { className as class };
</script>

<TabsPrimitive.Trigger
	class={cn(
		"inline-flex items-center justify-center whitespace-nowrap rounded-base border-2 border-transparent px-3 py-1.5 text-sm font-heading ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border data-[state=active]:bg-warning data-[state=active]:text-text",
		className
	)}
	{value}
	{...$$restProps}
	on:click
>
	<slot />
</TabsPrimitive.Trigger>
