<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SheetPrimitive.DescriptionProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SheetPrimitive.Description class={cn("text-sm font-base text-text", className)} {...$$restProps}>
	<slot />
</SheetPrimitive.Description>
