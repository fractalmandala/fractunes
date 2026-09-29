<script lang="ts">
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
  import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";
  import AnimA from "$lib/components/svganims/modulatorA.svelte";
  import AnimB from "$lib/components/svganims/modulatorB.svelte";

  const modWaves = ["Sine", "Triangle", "Saw", "Square", "Fold"];

  function cycleModAWave() {
    const curIdx = modWaves.findIndex(
      (w) => w.toLowerCase() === synthStore.modAWave.toLowerCase()
    );
    const next = modWaves[(curIdx + 1) % modWaves.length];
    synthStore.modAWave = next.toLowerCase();
    if (synthStore.modulators) {
      synthStore.modulators.setModA(null, null, next.toLowerCase());
    }
  }

  function cycleModBWave() {
    const curIdx = modWaves.findIndex(
      (w) => w.toLowerCase() === synthStore.modBWave.toLowerCase()
    );
    const next = modWaves[(curIdx + 1) % modWaves.length];
    synthStore.modBWave = next.toLowerCase();
    if (synthStore.modulators) {
      synthStore.modulators.setModB(null, null, next.toLowerCase());
    }
  }
</script>

<!-- MODULATOR A -->
<PrefittedBox span="is-3-wide">
  <Head title="Modulator A" hasDot={true}/>

  <div class="svg-container">
    <AnimA/>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Wave</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="param-val cursor-pointer tt-c"
        onclick={cycleModAWave}
      >
        {synthStore.modAWave}
      </div>
    </div>
    <div class="box">
      <div class="text-secondary text-xs">Rate</div>
      <ParamDrag
        bind:value={synthStore.modARate}
        min={0.05}
        max={8.0}
        step={0.05}
        sensitivity={0.04}
        format={(v) => `${v.toFixed(2)}Hz`}
        onChange={(v) => {
          if (synthStore.modulators) synthStore.modulators.setModA(v, null);
        }}
      />
    </div>
    <div class="box">
      <div class="text-secondary text-xs">Amount</div>
      <ParamDrag
        bind:value={synthStore.modAAmt}
        min={0}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}%`}
        onChange={(v) => {
          if (synthStore.modulators) synthStore.modulators.setModA(null, v);
        }}
      />
    </div>
  </div>
</PrefittedBox>

<!-- MODULATOR B -->
<PrefittedBox span="is-3-wide">
  <Head title="Modulator B" hasDot={true}/>

  <div class="svg-container">
    <AnimB/>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Wave</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="param-val cursor-pointer tt-c"
        onclick={cycleModBWave}
      >
        {synthStore.modBWave}
      </div>
    </div>
    <div class="box">
      <div class="text-secondary text-xs">Rate</div>
      <ParamDrag
        bind:value={synthStore.modBRate}
        min={0.05}
        max={8.0}
        step={0.05}
        sensitivity={0.04}
        format={(v) => `${v.toFixed(2)}Hz`}
        onChange={(v) => {
          if (synthStore.modulators) synthStore.modulators.setModB(v, null);
        }}
      />
    </div>
    <div class="box">
      <div class="text-secondary text-xs">Amount</div>
      <ParamDrag
        bind:value={synthStore.modBAmt}
        min={0}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}%`}
        onChange={(v) => {
          if (synthStore.modulators) synthStore.modulators.setModB(null, v);
        }}
      />
    </div>
  </div>
</PrefittedBox>
