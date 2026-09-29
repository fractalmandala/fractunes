<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseIcon from '$lib/icons/close.svelte';

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string;
		children?: Snippet;
		header?: Snippet;
		class?: string;
		ariaLabel?: string;
		dismissable?: boolean;
		showClose?: boolean;
		height?: number;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title = 'Settings',
		children,
		header,
		class: className,
		ariaLabel = title ?? 'Settings',
		dismissable = true,
		showClose = true,
		height = 360
	}: Props = $props();

	const panelClass = $derived(['settings-area', className].filter(Boolean).join(' '));

	function handleClose() {
		open = false;
		onOpenChange?.(false);
	}

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && dismissable) handleClose();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<aside
	role="region"
	aria-label={ariaLabel}
	data-slot="settings-modal"
	class={panelClass}
	style="height: {height}px;"
	inert={!open}
>
	<div class="box hfull shrink-0" style="height: {height}px; width: 100%;">
		{#if header}
			{@render header()}
		{:else if dismissable && showClose}
			<div class="row ycenter xbetween h-48 px-bs bb">
				<span class="box-title">{title}</span>
				<button
					type="button"
					data-variant="icon-mini"
					aria-label="Close settings"
					onclick={handleClose}
				>
					<CloseIcon />
				</button>
			</div>
		{/if}

		<div class="box grow px-bs py-bs overflow-auto">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</aside>



