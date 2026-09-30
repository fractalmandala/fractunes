<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  const tablesList = [
    "supersaw",
    "acid_303",
    "fm_squelch",
    "rolling",
    "formant",
    "spectral_bell",
    "distorted_saw"
  ];
  const warpModes = ["bend", "sync", "pwm", "fm"];

  let canvasEl: HTMLCanvasElement | null = $state(null);

  export function drawWavetableMesh() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    const warpAmt = synthStore.synthWarpAmt / 100;
    const table = synthStore.synthTable;

    const tableHarmonics: Record<string, number> = {
      supersaw: 4,
      acid_303: 2,
      fm_squelch: 7,
      rolling: 3,
      formant: 5,
      spectral_bell: 6,
      distorted_saw: 4
    };
    const harm = tableHarmonics[table] || 4;

    // 3D Wireframe Waterfall Stack
    ctx.strokeStyle = "#2e313b";
    ctx.lineWidth = 0.7;
    for (let row = 0; row < 5; row++) {
      ctx.beginPath();
      const yOffset = 18 + row * 16;
      for (let x = 0; x < w; x += 4) {
        const phase = x / w;
        const y =
          yOffset +
          Math.sin(phase * Math.PI * harm + row * 0.5 + warpAmt * 2) * (9 - row * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Active Front Single-Cycle Wave
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const phase = x / w;
      const y = 92 + Math.sin(phase * Math.PI * harm) * 18 * (1 + warpAmt * 0.4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function cycleTable() {
    synthStore.ensureAudio();
    const idx = (tablesList.indexOf(synthStore.synthTable) + 1) % tablesList.length;
    synthStore.synthTable = tablesList[idx];
    if (synthStore.engine.synth) synthStore.engine.synth.activeTable = synthStore.synthTable;
    drawWavetableMesh();
  }

  function cycleWarp() {
    synthStore.ensureAudio();
    const idx = (warpModes.indexOf(synthStore.synthWarpMode) + 1) % warpModes.length;
    synthStore.synthWarpMode = warpModes[idx];
    if (synthStore.engine.synth) synthStore.engine.synth.warpMode = synthStore.synthWarpMode;
    drawWavetableMesh();
  }

  $effect(() => {
    synthStore.synthTable;
    synthStore.synthWarpMode;
    synthStore.synthWarpAmt;
    drawWavetableMesh();
  });

  onMount(() => {
    drawWavetableMesh();
  });
</script>

<div class="module-box">
<Head title="Wavetable Synth" hasDot={true}>
    <button
      type="button"
      data-variant="small"
      data-shape="modern"
      class="mono text-xs"
      onclick={cycleTable}
    >
      {synthStore.synthTable.replaceAll("_", " ").toUpperCase()}
    </button>
  </Head>

  <div class="svg-container relative">
    <canvas
      bind:this={canvasEl}
      id="wavetableMeshCanvas"
      width="280"
      height="128"
      class="wfull hfull"
    ></canvas>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Warp</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="param-val cursor-pointer"
        onclick={cycleWarp}
      >
        {synthStore.synthWarpMode.toUpperCase()}+
      </div>
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Amount</div>
      <ParamDrag
        bind:value={synthStore.synthWarpAmt}
        min={0}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}%`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.warpAmount = v / 100;
          drawWavetableMesh();
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Unison</div>
      <ParamDrag
        bind:value={synthStore.synthUnison}
        min={1}
        max={9}
        step={1}
        sensitivity={0.08}
        format={(v) => `${Math.round(v)}v`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.unisonVoices = Math.round(v);
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Filter</div>
      <ParamDrag
        bind:value={synthStore.synthCutoff}
        min={0.4}
        max={16.0}
        step={0.1}
        sensitivity={0.08}
        format={(v) => `${v.toFixed(1)}k`}
        onChange={(v) => {
          synthStore.filterCutoff = v;
          if (synthStore.engine.synth) synthStore.engine.synth.cutoff = v * 1000;
        }}
      />
    </div>
  </div></div>