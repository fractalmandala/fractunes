<script lang="ts">
	import { onMount } from 'svelte';
	import { initPresets, toggleMode, getMode, onPresetChange } from '$lib/stores/appPresets.svelte';

	let { class: className = '' }: { class?: string } = $props();
	let currentMode = $state('dark');

	onMount(() => {
		initPresets();
		currentMode = getMode();
		return onPresetChange((axis, val) => {
			if (axis === 'mode') currentMode = val;
		});
	});

	const dark = $derived(currentMode === 'dark');
</script>

<button
	type="button"
	data-variant="icon"
	class={className}
	aria-pressed={dark}
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={dark ? 'Light mode' : 'Dark mode'}
	onclick={() => {
		toggleMode();
		currentMode = getMode();
	}}
>
	<svg width="20" height="20" viewBox="0 0 19 19" aria-hidden="true">
		{#if dark}
			<!-- Sun: filled core, eight rays -->
			<circle cx="9.5" cy="9.5" r="3.75" fill="currentColor" />
			{#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
				<line
					x1="9.5"
					y1="1.75"
					x2="9.5"
					y2="3.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					transform="rotate({angle} 9.5 9.5)"
				/>
			{/each}
		{:else}
			<!-- Moon: one circle bitten by another, as a single path -->
			<path
				d="M13.5 11.9A6.25 6.25 0 0 1 7.1 5.5a6.25 6.25 0 1 0 6.4 6.4Z"
				fill="currentColor"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
		{/if}
	</svg>
</button>
