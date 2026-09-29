<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { getBackground, isAura } from './registry.js'
	import type { BackgroundPreset } from './types.js'

	interface Props extends HTMLAttributes<HTMLElement> {
		/** A preset id (aura or pattern, e.g. "sunrise-drift", "basic-grid") or a preset object. */
		preset: string | BackgroundPreset
		/** Element to render. Default "div". */
		as?: string
		/** Pin the background to the viewport behind the whole page. */
		fixed?: boolean
		/** Aura only: multiply every layer's blur. Use a small value for thumbnails. Default 1. */
		blurScale?: number
		/** Aura only: also apply the preset's suggested text colour. Default false. */
		applyText?: boolean
		children?: Snippet
	}

	let {
		preset,
		as = 'div',
		fixed = false,
		blurScale = 1,
		applyText = false,
		children,
		class: className = '',
		style = '',
		...rest
	}: Props = $props()

	const resolved = $derived(typeof preset === 'string' ? getBackground(preset) : preset)
	const aura = $derived(resolved && isAura(resolved) ? resolved : undefined)
	const pattern = $derived(resolved && !isAura(resolved) ? resolved : undefined)
</script>

<svelte:element
	this={as}
	{...rest}
	class="bg-host {className}"
	class:bg-fixed={fixed}
	data-background={resolved?.id}
	style="{aura ? `--bg-base:${aura.base};` : ''}{applyText && aura ? `color:${aura.text};` : ''}{style}"
>
	{#if aura}
		<div class="bg-stack" aria-hidden="true" style="background-color:{aura.base}">
			{#each aura.layers as layer, i (i)}
				<div
					class="bg-layer"
					style="background:{layer.bg};mix-blend-mode:{layer.blend};--m:{layer.blur *
						blurScale}px;--d:{(layer.blurDesktop ?? layer.blur) * blurScale}px;opacity:{layer.opacity ??
						1}"
				></div>
			{/each}
		</div>
	{:else if pattern}
		<div class="bg-stack" aria-hidden="true">
			{#if pattern.keyframes}{@html `<style>${pattern.keyframes}</style>`}{/if}
			<div
				class="bg-pattern"
				style="{pattern.css}{pattern.bleed ? `;inset:-${pattern.bleed}px` : ''}"
			></div>
		</div>
	{/if}
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.bg-host {
		position: relative;
		isolation: isolate;
		height: 100%;
	}
	.bg-host.bg-fixed {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		height: 100%;
	}
	.bg-stack {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		isolation: isolate;
		pointer-events: none;
		border-radius: inherit;
		height: 100%;
	}
	.bg-pattern {
		position: absolute;
		inset: 0;
	}
	/* Auras overscan by the blur radius so blurred edges don't fade into the base colour. */
	.bg-layer {
		position: absolute;
		inset: calc(var(--b) * -1);
		--b: var(--m);
		filter: blur(var(--b));
		will-change: filter;
	}
	@media (min-width: 768px) {
		.bg-layer {
			--b: var(--d);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bg-pattern {
			animation: none !important;
		}
	}
</style>
