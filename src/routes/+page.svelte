<script lang="ts">
	import { onMount } from 'svelte';
	import { GridLayout, type LayoutItem } from '@snapgridjs/svelte';
	import { synthStore } from '$lib/stores/synthStore.svelte';
	import { layoutState } from '$lib/stores/layoutState.svelte';
	import RackTileWrapper from '$lib/components/rack/RackTileWrapper.svelte';

	// Rack Modules
	import MixerModule from '$lib/components/rack/MixerModule.svelte';
	import TransportModule from '$lib/components/rack/TransportModule.svelte';
	import StemsModule from '$lib/components/rack/StemsModule.svelte';
	import KickModule from '$lib/components/rack/KickModule.svelte';
	import HatsModule from '$lib/components/rack/HatsModule.svelte';
	import WavetableModule from '$lib/components/rack/WavetableModule.svelte';
	import FilterModule from '$lib/components/rack/FilterModule.svelte';
	import DelayModule from '$lib/components/rack/DelayModule.svelte';
	import ReverbModule from '$lib/components/rack/ReverbModule.svelte';
	import ModulatorAModule from '$lib/components/rack/ModulatorAModule.svelte';
	import ModulatorBModule from '$lib/components/rack/ModulatorBModule.svelte';
	import SequencerModule from '$lib/components/rack/SequencerModule.svelte';
	import { shortcutManager } from '$lib/stores/shortcuts.svelte';

	$effect(() => {
		const unregPlay = shortcutManager.register('play_pause', () => synthStore.togglePlay());
		const unregKick = shortcutManager.register('trigger_kick', () => {
			synthStore.ensureAudio();
			if (synthStore.engine.kick) synthStore.engine.kick.trigger();
		});
		const unregHatCl = shortcutManager.register('trigger_hat_cl', () => {
			synthStore.ensureAudio();
			if (synthStore.engine.hats) synthStore.engine.hats.trigger(false);
		});
		const unregHatOp = shortcutManager.register('trigger_hat_op', () => {
			synthStore.ensureAudio();
			if (synthStore.engine.hats) synthStore.engine.hats.trigger(true);
		});
		const unregBass = shortcutManager.register('trigger_bass', () => {
			synthStore.ensureAudio();
			if (synthStore.engine.synth && synthStore.engine.kick) {
				synthStore.engine.synth.triggerRollingBass(1, synthStore.engine.kick.rootPitch);
			}
		});

		return () => {
			unregPlay();
			unregKick();
			unregHatCl();
			unregHatOp();
			unregBass();
		};
	});

	onMount(() => {
		synthStore.loadPresetByIdx(0);
	});
</script>

<div class="box pad-bs wfull hfull">
	<div
		{@attach layoutState.attach}
		class={['rack-grid-container grow', layoutState.activeDraggingId && 'is-dragging'].filter(Boolean).join(' ')}
	>
		{#if layoutState.containerWidth > 0}
			<GridLayout
				width={layoutState.containerWidth}
				layout={layoutState.layout}
				onLayoutChange={layoutState.handleLayoutChange}
				onResizeStart={layoutState.handleResizeStart}
				onResizeStop={layoutState.handleResizeStop}
				onDragStart={layoutState.handleDragStart}
				onDragStop={layoutState.handleDragStop}
				gridConfig={layoutState.gridConfig}
				resizeConfig={{
					enabled: true,
					handles: ['se', 's', 'e']
				}}
				dragConfig={{
					enabled: true,
					bounded: true,
					threshold: 3
				}}
				compactor={layoutState.compactor}
				isDraggable={true}
				isResizable={true}
			>
				{#snippet item(item: LayoutItem)}
					<RackTileWrapper
						id={item.i}
						isDragging={layoutState.isDragging(item.i)}
						isResizing={layoutState.isResizing(item.i)}
					>
						{#if item.i === 'mixer'}
							<MixerModule />
						{:else if item.i === 'player'}
							<TransportModule />
						{:else if item.i === 'stems'}
							<StemsModule />
						{:else if item.i === 'kick'}
							<KickModule />
						{:else if item.i === 'drums'}
							<HatsModule />
						{:else if item.i === 'wavetable'}
							<WavetableModule />
						{:else if item.i === 'filters'}
							<FilterModule />
						{:else if item.i === 'delay'}
							<DelayModule />
						{:else if item.i === 'reverb'}
							<ReverbModule />
						{:else if item.i === 'modulatorA'}
							<ModulatorAModule />
						{:else if item.i === 'modulatorB'}
							<ModulatorBModule />
						{:else if item.i === 'sequencer'}
							<SequencerModule />
						{/if}
					</RackTileWrapper>
				{/snippet}
			</GridLayout>
		{/if}
	</div>
</div>
