<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import { SOUNDBANK } from "$lib/audio/presets";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  let canvasEl: HTMLCanvasElement | null = $state(null);
  let animId: number;

  function renderWaveform() {
    if (canvasEl) {
      const ctx = canvasEl.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Center line
        ctx.strokeStyle = "#191b22";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvasEl.height / 2);
        ctx.lineTo(canvasEl.width, canvasEl.height / 2);
        ctx.stroke();

        // Oscilloscope
        const eng = synthStore.engine;
        if (eng.analyser && synthStore.isPlaying) {
          const data = new Uint8Array(eng.analyser.frequencyBinCount);
          eng.analyser.getByteTimeDomainData(data);
          ctx.strokeStyle = "#e85526";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const slice = canvasEl.width / data.length;
          let x = 0;
          for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0;
            const y = (v * canvasEl.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += slice;
          }
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(renderWaveform);
  }

  onMount(() => {
    animId = requestAnimationFrame(renderWaveform);
    return () => cancelAnimationFrame(animId);
  });
</script>

<div class="module-box">
<Head title="Fractunes Soundbank" hasDot={true}>
    <div class="row ycenter gap-3">
      <select
        id="presetSelect"
        value={synthStore.selectedPresetIdx}
        onchange={(e) => synthStore.loadPresetByIdx(parseInt(e.currentTarget.value, 10))}
      >
        {#each SOUNDBANK as preset, i}
          <option value={i}>
            {preset.name} ({preset.tempo} BPM · {preset.key})
          </option>
        {/each}
      </select>
      <span class="text-secondary text-xs mono" id="keyLabel">
        {synthStore.keyLabel}
      </span>
    </div>
  </Head>

  <!-- Waveform timeline & play button -->
  <div class="timeline-track-wrap">
    <canvas
      bind:this={canvasEl}
      id="masterTimelineCanvas"
      width="600"
      height="64"
      class="wfull hfull"
    ></canvas>
    <button
      id="playBtn"
      onclick={() => synthStore.togglePlay()}
      aria-label="Play / Pause"
    >
      <span>{synthStore.isPlaying ? "⏹" : "▶"}</span>
    </button>
  </div>

  <div class="row xbetween ycenter bt pt-sm mono">
    <span class="text-secondary text-xs">
      {synthStore.subgenreLabel}
    </span>
    <div class="row ycenter gap-sm">
      <div class="row ycenter gap-3xs">
        <span class="text-secondary text-xs">BPM</span>
        <ParamDrag
          bind:value={synthStore.tempo}
          min={120}
          max={160}
          step={0.5}
          sensitivity={0.3}
          format={(v) => v.toFixed(1)}
          onChange={(v) => {
            synthStore.sequencer.tempo = v;
          }}
        />
      </div>
      <span id="timecode" class="text-muted text-xs mono">
        {synthStore.timecode}
      </span>
    </div>
  </div>

</div>