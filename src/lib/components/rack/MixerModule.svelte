<script lang="ts">
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
	import PrefittedBox from "../PrefittedBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  const tracks: Array<"kick" | "bass" | "lead" | "hats" | "master"> = [
    "kick",
    "bass",
    "lead",
    "hats",
    "master"
  ];
  const trackLabels: Record<string, string> = {
    kick: "Kick",
    bass: "Bass",
    lead: "Lead",
    hats: "Hats",
    master: "Out"
  };

  function handleFaderDown(track: "kick" | "bass" | "lead" | "hats" | "master", e: MouseEvent) {
    e.preventDefault();
    synthStore.ensureAudio();

    const trackEl = e.currentTarget as HTMLElement;
    const updateFader = (me: MouseEvent) => {
      const rect = trackEl.getBoundingClientRect();
      const height = rect.height;
      const y = Math.max(0, Math.min(height, rect.bottom - me.clientY));
      const pct = y / height;
      synthStore.setVolume(track, pct);
    };

    updateFader(e);

    const onMove = (me: MouseEvent) => updateFader(me);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }
</script>

<PrefittedBox span="is-3-wide">
  <Head title="Mixer" hasDot={true}/>

  <div class="row xbetween ybot px-3 py-1 my-auto">
    {#each tracks as tr}
      <div class="box xcenter gap-1.5">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
          class="text-secondary text-xs mono cursor-pointer hover:text-white"
          style:opacity={synthStore.muted[tr] ? "0.3" : "1.0"}
          onclick={() => synthStore.toggleMute(tr)}
          title="Click to Mute {trackLabels[tr]}"
        >
          {trackLabels[tr]}
        </span>

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="fader-track cursor-pointer"
          onmousedown={(e) => handleFaderDown(tr, e)}
        >
          <div
            class="fader-thumb"
            style:bottom="{Math.round(synthStore.volumes[tr] * 100)}%"
            style:opacity={synthStore.muted[tr] ? "0.2" : "1.0"}
          ></div>
        </div>
      </div>
    {/each}
  </div>

  <div class="row xbetween ycenter bt pt-sm">
    <div class="box">
      <div class="text-secondary text-xs">Gain</div>
      <ParamDrag
        bind:value={synthStore.volumes.master}
        min={0}
        max={1}
        step={0.01}
        sensitivity={0.8}
        format={(v) => String(Math.round(v * 100))}
        onChange={(v) => synthStore.setVolume("master", v)}
      />
    </div>

    <div class="box">
      <div class="text-secondary text-xs">Pan</div>
      <ParamDrag
        bind:value={synthStore.pan}
        min={-100}
        max={100}
        step={1}
        sensitivity={0.8}
        format={(v) => String(Math.round(v))}
        onChange={(v) => synthStore.engine.setPan(v / 100)}
      />
    </div>

    <button
      type="button"
      data-variant="small"
      data-shape="modern"
      class:active={synthStore.leadEnabled}
      onclick={() => synthStore.toggleLead()}
    >
      Lead: {synthStore.leadEnabled ? "ON" : "OFF"}
    </button>
  </div>
</PrefittedBox>
