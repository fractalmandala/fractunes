<script lang="ts">
	import { onMount } from 'svelte';
	import { synthStore } from '$lib/stores/synthStore.svelte';

	// Row 1
	import MixerModule from '$lib/components/rack/MixerModule.svelte';
	import TransportModule from '$lib/components/rack/TransportModule.svelte';
	import StemsModule from '$lib/components/rack/StemsModule.svelte';

	// Row 2
	import KickModule from '$lib/components/rack/KickModule.svelte';
	import HatsModule from '$lib/components/rack/HatsModule.svelte';
	import WavetableModule from '$lib/components/rack/WavetableModule.svelte';
	import FilterModule from '$lib/components/rack/FilterModule.svelte';

	// Row 3
	import DelayModule from '$lib/components/rack/DelayModule.svelte';
	import ReverbModule from '$lib/components/rack/ReverbModule.svelte';
	import ModulatorModule from '$lib/components/rack/ModulatorModule.svelte';
	import SequencerModule from '$lib/components/rack/SequencerModule.svelte';

	function onKeyDown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

		if (e.code === 'Space') {
			e.preventDefault();
			synthStore.togglePlay();
		} else if (e.key === '1') {
			e.preventDefault();
			synthStore.ensureAudio();
			if (synthStore.engine.kick) synthStore.engine.kick.trigger();
		} else if (e.key === '2') {
			e.preventDefault();
			synthStore.ensureAudio();
			if (synthStore.engine.hats) synthStore.engine.hats.trigger(false);
		} else if (e.key === '3') {
			e.preventDefault();
			synthStore.ensureAudio();
			if (synthStore.engine.hats) synthStore.engine.hats.trigger(true);
		} else if (e.key === '4') {
			e.preventDefault();
			synthStore.ensureAudio();
			if (synthStore.engine.synth && synthStore.engine.kick) {
				synthStore.engine.synth.triggerRollingBass(1, synthStore.engine.kick.rootPitch);
			}
		}
	}

	onMount(() => {
		// Boot: load factory preset into engine and store
		synthStore.loadPresetByIdx(0);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="box gap-bs pad-bs">
	<!-- ROW 1: MIXER, DISPLAY & TRANSPORT, BUFFER (3 Distinct Modules) -->
	<div class="one-shelf">
		<MixerModule />
		<TransportModule />
		<StemsModule />
	</div>

	<!-- ROW 2: 4 DEDICATED SYNTHESIS MODULES (Kick, Hats, Wavetable, Filter) -->
	<div class="one-shelf">
		<KickModule />
		<HatsModule />
		<WavetableModule />
		<FilterModule />
	</div>

	<!-- ROW 3: 5 DEDICATED DSP MODULES (Delay, Reverb, Modulator A, Modulator B, Sequencer) -->
	<div class="one-shelf">
		<DelayModule />
		<ReverbModule />
		<ModulatorModule />
	</div>
	<div class="one-shelf is-centered">
		<SequencerModule />
	</div>
</div>
