<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = AvatarPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export let delayMs: $$Props["delayMs"] = undefined;
	export { className as class };
</script>

<AvatarPrimitive.Root
	{delayMs}
	class={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline-2 outline-border", className, "outline")}
	{...$$restProps}
>
	<slot />
</AvatarPrimitive.Root>
