<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = AvatarPrimitive.FallbackProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<AvatarPrimitive.Fallback
	class={cn("flex h-full w-full items-center justify-center rounded-full bg-bw text-text font-base", className)}
	{...$$restProps}
>
	<slot />
</AvatarPrimitive.Fallback>
