<script lang="ts">
	import { onMount } from 'svelte';
	import { presetAxes, presets, initPresets, setPreset } from '$lib/stores/appPresets.svelte.js';

	let { class: className = '' }: { class?: string } = $props();

	onMount(() => initPresets());

</script>

<div class="box {className}" role="group" aria-label="Layout density preset">
	{#each presetAxes.layout as layout}
		<button
			type="button"
			data-variant="small"
			data-shape="modern"
			class:active={presets.layout === layout}
			aria-pressed={presets.layout === layout}
			title={layout}
			onclick={() => setPreset('layout', layout)}
		>
			<span class="text-sm tt-u">{layout}</span>
		</button>
	{/each}
</div>
