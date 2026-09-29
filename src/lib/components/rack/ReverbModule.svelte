<script lang="ts">
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
  import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";
  import Anim from "$lib/components/svganims/reverb.svelte";
</script>

<PrefittedBox span="is-3-wide">
  <Head title="Reverb" hasDot={true}>
    <span class="text-secondary text-xs">Hall ▾</span>
  </Head>

  <div class="svg-container">
    <Anim/>
  </div>

  <div class="row xbetween bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Size</div>
      <ParamDrag
        bind:value={synthStore.reverbSize}
        min={10}
        max={100}
        step={1}
        sensitivity={0.5}
        format={(v) => String(Math.round(v))}
        onChange={(v) => {
          if (synthStore.engine.fx) {
            synthStore.engine.fx.setReverbSize(v);
            synthStore.reverbDecay = synthStore.engine.fx.reverbDecay;
          }
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Decay</div>
      <ParamDrag
        bind:value={synthStore.reverbDecay}
        min={0.4}
        max={6.0}
        step={0.1}
        sensitivity={0.05}
        format={(v) => `${v.toFixed(1)}s`}
        onChange={(v) => {
          if (synthStore.engine.fx) synthStore.engine.fx.setReverbDecay(v);
        }}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Wet</div>
      <ParamDrag
        bind:value={synthStore.reverbWet}
        min={0}
        max={80}
        step={1}
        sensitivity={0.5}
        format={(v) => `${Math.round(v)}%`}
        onChange={(v) => {
          if (synthStore.engine.fx) synthStore.engine.fx.setReverbWet(v / 100);
        }}
      />
    </div>
  </div>
</PrefittedBox>
