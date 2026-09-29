<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
	import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  let canvasEl: HTMLCanvasElement | null = $state(null);
  let dragging = false;

  export function drawBezier() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    // Background Grid
    ctx.strokeStyle = "#1a1c22";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 26) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Pitch Curve
    ctx.beginPath();
    ctx.strokeStyle = "#e85526";
    ctx.lineWidth = 1.4;

    const bez = synthStore.engine.kick ? synthStore.engine.kick.bezier : null;
    const fMin = 30;
    const fMax = 8500;
    const yForF = (f: number) => {
      const logF = Math.log(Math.max(fMin, f)) - Math.log(fMin);
      const logR = Math.log(fMax) - Math.log(fMin);
      return 10 + (1 - Math.min(1, Math.max(0, logF / logR))) * (h - 24);
    };

    if (bez) {
      for (let i = 0; i <= 48; i++) {
        const u = i / 48;
        const f = bez.evaluate(u);
        const x = 8 + u * (w - 16);
        const y = yForF(f);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else {
      ctx.moveTo(8, 14);
      ctx.lineTo(w - 8, h - 14);
    }
    ctx.stroke();

    // Control Handle Point
    const punch = synthStore.kickPunch;
    const punchY = h - (punch / 100) * (h * 0.75);
    ctx.fillStyle = "#e85526";
    ctx.beginPath();
    ctx.arc(45, punchY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(232, 85, 38, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(45, punchY, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  function handleCanvasMove(e: MouseEvent) {
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const pitchDec = 0.03 + (x / rect.width) * 0.15;
    const punchNorm = 1.0 - y / rect.height;
    const punchVal = Math.round(punchNorm * 90 + 10);

    synthStore.kickPitchDec = Math.round(pitchDec * 1000);
    synthStore.kickPunch = punchVal;

    if (synthStore.engine.kick) {
      synthStore.engine.kick.pitchDecay = pitchDec;
      synthStore.engine.kick.setPunch(punchVal);
    }
    drawBezier();
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    synthStore.ensureAudio();
    dragging = true;
    handleCanvasMove(e);
    if (synthStore.engine.kick) synthStore.engine.kick.trigger();

    const onMove = (me: MouseEvent) => {
      if (dragging) handleCanvasMove(me);
    };
    const onUp = () => {
      dragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function triggerKick() {
    synthStore.ensureAudio();
    if (synthStore.engine.kick) synthStore.engine.kick.trigger();
  }

  $effect(() => {
    // Redraw whenever parameters change
    synthStore.kickPitch;
    synthStore.kickPunch;
    synthStore.kickPitchDec;
    drawBezier();
  });

  onMount(() => {
    drawBezier();
  });
</script>

<PrefittedBox span="is-3-wide">
  <Head title="Psytrance Kick" hasDot={true}>
    <button id="testKickBtn" onclick={triggerKick}>Trigger</button>
  </Head>

  <div class="svg-container relative">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <canvas
      bind:this={canvasEl}
      id="kickBezierCanvas"
      width="280"
      height="128"
      class="wfull hfull cursor-crosshair"
      onmousedown={onMouseDown}
    ></canvas>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Pitch</div>
      <ParamDrag
        bind:value={synthStore.kickPitch}
        min={36}
        max={85}
        step={0.5}
        sensitivity={0.4}
        format={(v) => `${v.toFixed(1)}Hz`}
        onChange={(v) => {
          if (synthStore.engine.kick) synthStore.engine.kick.setTuning(v);
          drawBezier();
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Pitch-Dec</div>
      <ParamDrag
        bind:value={synthStore.kickPitchDec}
        min={30}
        max={180}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(v) => {
          if (synthStore.engine.kick) synthStore.engine.kick.pitchDecay = v / 1000;
          drawBezier();
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Vol-Dec</div>
      <ParamDrag
        bind:value={synthStore.kickVolDec}
        min={60}
        max={280}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(v) => {
          if (synthStore.engine.kick) synthStore.engine.kick.volDecay = v / 1000;
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Punch</div>
      <ParamDrag
        bind:value={synthStore.kickPunch}
        min={10}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => String(Math.round(v))}
        onChange={(v) => {
          if (synthStore.engine.kick) synthStore.engine.kick.setPunch(v);
          drawBezier();
        }}
      />
    </div>
  </div>
</PrefittedBox>