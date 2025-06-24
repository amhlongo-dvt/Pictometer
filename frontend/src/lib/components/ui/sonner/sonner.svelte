<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";

	type $$Props = SonnerProps;
</script>

<Sonner
	theme={$mode}
	class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 font-base sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
	toastOptions={{
		classes: {
			toast: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-base border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark p-6 pr-8 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
			description: "text-sm font-base",
			actionButton: "inline-flex h-8 shrink-0 items-center justify-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-3 text-sm font-base text-text ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50",
			cancelButton: "absolute right-2 top-2 rounded-md p-1 text-text text-inherit opacity-0 transition-opacity group-hover:opacity-100",
		},
	}}
	{...$$restProps}
/>
