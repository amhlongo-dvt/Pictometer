<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		"inline-flex h-12 items-center justify-center rounded-base border-2 border-border bg-main p-1 text-mtext",
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
