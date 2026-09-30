<script lang="ts">
	import { motion, useReducedMotion } from '@humanspeak/svelte-motion';
	import type { Snippet } from 'svelte';
	import { SPRING_PANEL, EASE_OUT } from '$lib/stores/ease.js';
	import CloseIcon from '$lib/icons/close.svelte';
	import Github from '$lib/icons/github.svelte'
	import Twitter from '$lib/icons/twitter.svelte'
	import Settings from '$lib/icons/settings.svelte'

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		side?: 'left' | 'right';
		title?: string;
		children?: Snippet;
		header?: Snippet;
		class?: string;
		ariaLabel?: string;
		dismissable?: boolean;
		showClose?: boolean;
		width?: number;
		onSettingsClick?: () => void;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		side = 'left',
		title,
		children,
		header,
		class: className,
		ariaLabel = title ?? 'Sidebar',
		dismissable = true,
		showClose = true,
		width = 280,
		onSettingsClick
	}: Props = $props();

	const reduce = useReducedMotion();
	const panelClass = $derived(['drawer-panel', className].filter(Boolean).join(' '));

	function handleClose() {
		open = false;
		onOpenChange?.(false);
	}

	async function openExternal(url: string, e: MouseEvent) {
		e.preventDefault();
		try {
			const { invoke } = await import('@tauri-apps/api/core');
			await invoke('open_external_url', { url });
		} catch {
			window.open(url, '_blank');
		}
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

<motion.aside
	role="region"
	aria-label={ariaLabel}
	data-slot="drawer-panel"
	data-side={side}
	class={panelClass}
	initial={false}
	animate={{
		width: open ? width : 0,
		opacity: open ? 1 : 0
	}}
	transition={$reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_PANEL}
>
	<div class="box hfull shrink-0" style="width: {width}px;">
		{#if header}
			{@render header()}
		{:else if dismissable && showClose}
			<div class="row ycenter xright h-48 px-bs">
				<button
					type="button"
					data-variant="icon-mini"
					aria-label="Close drawer"
					onclick={handleClose}
				>
					<CloseIcon />
				</button>
			</div>
		{/if}
		<div class="box grow px-bs">
			{#if children}
				{@render children()}
			{/if}
			<footer class="sidebar-footer row bt">
				<div class="logobox">
					<img class="motif-c" src="/images/motif-c.png" alt="motif color"/>
					<img class="motif-g" src="/images/motif-g.png" alt="motif green"/>	
				</div>
				<div class="box py-bs grow">
<div class="row xbetween ycenter mt-xs wfull">				
<div class="row gap-sm ycenter grow min0 wfull">
<button data-variant="link" class="text-sm text-secondary xleft ta-l lh11" onclick={(e: MouseEvent) => openExternal('https://github.com/fractalmandala', e)}><Github/></button>
<button data-variant="link" class="text-sm text-secondary xleft ta-l lh11" onclick={(e: MouseEvent) => openExternal('https://x.com/saamaanyafreaky', e)}><Twitter/></button>
</div>
<button
	type="button"
	data-variant="icon"
	onclick={() => onSettingsClick?.()}
	title="Settings (⌘K)"
	aria-label="Settings (⌘K)"
>
	<Settings />
</button>	
					</div>
				</div>
			</footer>
		</div>
	</div>
</motion.aside>


