<script lang="ts">
	import { onMount } from 'svelte';
	import { presetAxes, initPresets, setPreset, presetState, onPresetChange } from '$lib/stores/appPresets.svelte';

	let { class: className = '' }: { class?: string } = $props();
	let currentShape = $state('default');

	onMount(() => {
		initPresets();
		currentShape = presetState.shape;
		return onPresetChange((axis, val) => {
			if (axis === 'shape') currentShape = val;
		});
	});

	// Corner glyphs — one square, four geometries; rx mirrors the sm channel.
	const glyphs: Record<string, number> = { sharp: 0, default: 4, round: 16 };
</script>

<div class="row gap-xs {className}" role="group" aria-label="Shape preset">
	{#each presetAxes.shape as shape}
		<button
			type="button"
			data-variant="icon"
			class:active={currentShape === shape}
			aria-pressed={currentShape === shape}
			title={shape}
			onclick={() => setPreset('shape', shape)}
		>
			<svg width="16" height="16" viewBox="0 0 19 19" aria-hidden="true">
				<rect
					x="1.5"
					y="1.5"
					width="16"
					height="16"
					rx={glyphs[shape] ?? 4}
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				/>
			</svg>
		</button>
	{/each}
</div>
