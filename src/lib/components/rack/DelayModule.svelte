<script lang="ts">
	import { synthStore } from '$lib/stores/synthStore.svelte';
	import ParamDrag from '$lib/components/ParamDrag.svelte';
	import Head from '$lib/components/ui/BoxHead.svelte';
	import Anim from '$lib/components/svganims/delay.svelte';

	function syncDotted8th() {
		synthStore.ensureAudio();
		const dotted8 = (60.0 / synthStore.tempo) * 0.75;
		synthStore.delayTime = Math.round(dotted8 * 1000);
		if (synthStore.engine.fx) synthStore.engine.fx.setDelayTime(dotted8);
	}
</script>

<div class="module-box">
	<Head title="Delay" hasDot={true} />
	<div class="svg-container">
		<Anim />
	</div>
	<div class="row xbetween bt pt-sm">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="box" ondblclick={syncDotted8th} title="Drag: ms · Double-click: dotted-8th sync">
			<div class="text-secondary text-xs">Time</div>
			<ParamDrag
				bind:value={synthStore.delayTime}
				min={50}
				max={800}
				step={2}
				sensitivity={0.8}
				format={(v) => `${Math.round(v)}ms`}
				onChange={(v) => {
					if (synthStore.engine.fx) synthStore.engine.fx.setDelayTime(v / 1000);
				}}
			/>
		</div>

		<div class="box">
			<div class="text-secondary text-xs">Feedback</div>
			<ParamDrag
				bind:value={synthStore.delayFeedback}
				min={0}
				max={85}
				step={1}
				sensitivity={0.5}
				format={(v) => `${Math.round(v)}%`}
				onChange={(v) => {
					if (synthStore.engine.fx) synthStore.engine.fx.setDelayFeedback(v / 100);
				}}
			/>
		</div>

		<div class="box">
			<div class="text-secondary text-xs">Filter</div>
			<ParamDrag
				bind:value={synthStore.delayFilter}
				min={0.5}
				max={12.0}
				step={0.1}
				sensitivity={0.08}
				format={(v) => `${v.toFixed(1)}k`}
				onChange={(v) => {
					if (synthStore.engine.fx) synthStore.engine.fx.setDelayFilter(v * 1000);
				}}
			/>
		</div>
	</div>
</div>
