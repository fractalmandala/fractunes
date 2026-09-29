<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
	import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  let canvasEl: HTMLCanvasElement | null = $state(null);
  let dragging = false;

  export function drawFilterCurve() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#1a1c22";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const cutoff = synthStore.filterCutoff * 1000;
    const res = synthStore.filterRes;
    const slope = synthStore.filterSlope;
    const cutX = Math.max(20, Math.min(w - 20, (cutoff / 18000) * w));
    const resPeak = Math.min(30, res * 4.5);

    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(10, 48);
    ctx.lineTo(cutX - 16, 48);
    if (slope === "24dB") {
      ctx.bezierCurveTo(cutX - 5, 48 - resPeak, cutX + 8, h - 10, w - 10, h - 8);
    } else {
      ctx.bezierCurveTo(cutX - 5, 48 - resPeak, cutX + 15, h - 16, w - 10, h - 16);
    }
    ctx.stroke();

    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = "#3e4250";
    ctx.beginPath();
    ctx.moveTo(10, h - 22);
    ctx.lineTo(w - 10, h - 22);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function handleFilterMove(e: MouseEvent) {
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yNorm = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));

    const cutoff = 200 * Math.pow(90, xNorm);
    const res = Math.max(0, Math.min(8, yNorm * 8));

    synthStore.filterCutoff = cutoff / 1000;
    synthStore.synthCutoff = cutoff / 1000;
    synthStore.filterRes = res;

    if (synthStore.engine.synth) {
      synthStore.engine.synth.cutoff = cutoff;
      synthStore.engine.synth.resonance = res;
    }
    drawFilterCurve();
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    synthStore.ensureAudio();
    dragging = true;
    handleFilterMove(e);

    const onMove = (me: MouseEvent) => {
      if (dragging) handleFilterMove(me);
    };
    const onUp = () => {
      dragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function toggleSlope() {
    synthStore.ensureAudio();
    synthStore.filterSlope = synthStore.filterSlope === "24dB" ? "12dB" : "24dB";
    if (synthStore.engine.synth) synthStore.engine.synth.filterSlope = synthStore.filterSlope;
    drawFilterCurve();
  }

  function toggleScale() {
    synthStore.ensureAudio();
    synthStore.filterScale = synthStore.filterScale === "Chr" ? "Min" : "Chr";
    if (synthStore.engine.synth) synthStore.engine.synth.filterScale = synthStore.filterScale;
  }

  $effect(() => {
    synthStore.filterCutoff;
    synthStore.filterRes;
    synthStore.filterSlope;
    drawFilterCurve();
  });

  onMount(() => {
    drawFilterCurve();
  });
</script>

<PrefittedBox span="is-3-wide">
  <Head title="Filter Strip" hasDot={true}/>

  <div class="svg-container relative">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <canvas
      bind:this={canvasEl}
      id="filterCurveCanvas"
      width="280"
      height="128"
      class="wfull hfull cursor-crosshair"
      onmousedown={onMouseDown}
    ></canvas>
  </div>

  <div class="one-shelf bt pt-sm">
    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Cutoff</div>
      <ParamDrag
        bind:value={synthStore.filterCutoff}
        min={0.2}
        max={18.0}
        step={0.1}
        sensitivity={0.08}
        format={(v) => `${v.toFixed(1)}k`}
        onChange={(v) => {
          synthStore.synthCutoff = v;
          if (synthStore.engine.synth) synthStore.engine.synth.cutoff = v * 1000;
          drawFilterCurve();
        }}
      />
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Res</div>
      <ParamDrag
        bind:value={synthStore.filterRes}
        min={0}
        max={8.0}
        step={0.1}
        sensitivity={0.05}
        format={(v) => v.toFixed(1)}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.resonance = v;
          drawFilterCurve();
        }}
      />
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Decay</div>
      <ParamDrag
        bind:value={synthStore.filterDecay}
        min={20}
        max={250}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.filterDecay = v;
        }}
      />
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Pitch</div>
      <ParamDrag
        bind:value={synthStore.filterPitch}
        min={-12}
        max={12}
        step={1}
        sensitivity={0.2}
        format={(v) => `${v > 0 ? "+" : ""}${Math.round(v)}`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.filterPitch = Math.round(v);
        }}
      />
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Slope</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="param-val cursor-pointer"
        onclick={toggleSlope}
      >
        {synthStore.filterSlope}
      </div>
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Tone</div>
      <ParamDrag
        bind:value={synthStore.filterTone}
        min={-50}
        max={50}
        step={1}
        sensitivity={0.4}
        format={(v) => `${v > 0 ? "+" : ""}${Math.round(v)}`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.filterTone = Math.round(v);
        }}
      />
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Scale</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="param-val cursor-pointer"
        onclick={toggleScale}
      >
        {synthStore.filterScale}
      </div>
    </div>

    <div class="is-3-wide box">
      <div class="text-secondary text-xs">Wet</div>
      <ParamDrag
        bind:value={synthStore.filterWet}
        min={0}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}%`}
        onChange={(v) => {
          if (synthStore.engine.synth) synthStore.engine.synth.filterWet = v / 100;
        }}
      />
    </div>
  </div>
</PrefittedBox>