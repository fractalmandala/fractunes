<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
	import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  let canvasEl: HTMLCanvasElement | null = $state(null);

  export function drawHatsSpectrum() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#20222a";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, h - 16);
    ctx.lineTo(w, h - 16);
    ctx.stroke();

    // Cutoff slope
    const cutoff = synthStore.hatCutoff * 1000;
    const cutoffX = Math.max(10, Math.min(w - 20, (cutoff / 18000) * w));

    ctx.strokeStyle = "#9094a2";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 16);
    ctx.lineTo(cutoffX - 15, h - 16);
    ctx.lineTo(cutoffX, 24);
    ctx.lineTo(w, h - 24);
    ctx.stroke();

    // Inharmonic 6-peak cluster
    ctx.fillStyle = "#e85526";
    [0.64, 0.71, 0.79, 0.86, 0.93].forEach((p) => {
      ctx.fillRect(w * p, h - 42, 1.2, 26);
    });
  }

  function triggerHat(isOpen: boolean) {
    synthStore.ensureAudio();
    if (synthStore.engine.hats) synthStore.engine.hats.trigger(isOpen);
  }

  $effect(() => {
    synthStore.hatCutoff;
    synthStore.hatRes;
    drawHatsSpectrum();
  });

  onMount(() => {
    drawHatsSpectrum();
  });
</script>

<PrefittedBox span="is-3-wide">
  <Head title="Metallic Hats" hasDot={true}>
    <button type="button" data-variant="small" data-shape="modern" onclick={() => triggerHat(false)}>Cl</button>
    <button type="button" data-variant="small" data-shape="modern" onclick={() => triggerHat(true)}>Op</button>
  </Head>

  <div class="svg-container relative">
    <canvas
      bind:this={canvasEl}
      id="hatsSpectrumCanvas"
      width="280"
      height="128"
      class="wfull hfull"
    ></canvas>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Highpass</div>
      <ParamDrag
        bind:value={synthStore.hatCutoff}
        min={3.5}
        max={16.0}
        step={0.1}
        sensitivity={0.08}
        format={(v) => `${v.toFixed(1)}kHz`}
        onChange={(v) => {
          if (synthStore.engine.hats) synthStore.engine.hats.cutoff = v * 1000;
          drawHatsSpectrum();
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Ring (Q)</div>
      <ParamDrag
        bind:value={synthStore.hatRes}
        min={0.5}
        max={8.0}
        step={0.1}
        sensitivity={0.05}
        format={(v) => v.toFixed(1)}
        onChange={(v) => {
          if (synthStore.engine.hats) synthStore.engine.hats.resonance = v;
          drawHatsSpectrum();
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Cl. Dec</div>
      <ParamDrag
        bind:value={synthStore.hatClDec}
        min={10}
        max={60}
        step={1}
        sensitivity={0.4}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(v) => {
          if (synthStore.engine.hats) synthStore.engine.hats.closedDecay = v / 1000;
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Op. Dec</div>
      <ParamDrag
        bind:value={synthStore.hatOpDec}
        min={60}
        max={350}
        step={2}
        sensitivity={0.6}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(v) => {
          if (synthStore.engine.hats) synthStore.engine.hats.openDecay = v / 1000;
        }}
      />
    </div>
  </div>
</PrefittedBox>