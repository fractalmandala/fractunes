<script lang="ts">
  import { onMount } from "svelte";
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import { listMidiInputs, type MidiDevice } from "$lib/native/tauriBridge";
  import Head from "$lib/components/ui/BoxHead.svelte";

  let isExportingMaster = $state(false);
  let isExportingStems = $state(false);
  let exportNotice = $state<string | null>(null);
  let midiDevices = $state<MidiDevice[]>([]);

  onMount(async () => {
    midiDevices = await listMidiInputs();
  });

  async function exportMaster() {
    synthStore.ensureAudio();
    isExportingMaster = true;
    exportNotice = null;
    try {
      if (synthStore.engine.exporter) {
        await synthStore.engine.exporter.exportMasterTake(4);
        exportNotice = "Master WAV exported";
      }
    } catch (e) {
      console.error("Export master error:", e);
    } finally {
      isExportingMaster = false;
    }
  }

  async function exportStems() {
    synthStore.ensureAudio();
    isExportingStems = true;
    exportNotice = null;
    try {
      if (synthStore.engine.exporter) {
        await synthStore.engine.exporter.exportAllStems(4);
        exportNotice = "5 Stems exported";
      }
    } catch (e) {
      console.error("Export stems error:", e);
    } finally {
      isExportingStems = false;
    }
  }
</script>

<div class="module-box">
<Head title="Stems & Buffer" hasDot={true}>
    <span class="text-xs text-theme mono">WAV 16-bit</span>
  </Head>

  <div class="box gap-xs my-auto">
    <button
      type="button"
      data-variant="small"
      data-shape="modern"
      class="row xbetween ycenter"
      disabled={isExportingMaster}
      onclick={exportMaster}
    >
      {#if isExportingMaster}
        <span>Rendering Master Take (WAV)...</span>
        <span class="text-theme">⏳</span>
      {:else}
        <span>Export Master Take (WAV)</span>
        <span class="text-theme">↓</span>
      {/if}
    </button>

    <button
      type="button"
      data-variant="small"
      data-shape="modern"
      class="row xbetween ycenter"
      disabled={isExportingStems}
      onclick={exportStems}
    >
      {#if isExportingStems}
        <span>Rendering 5 Stems...</span>
        <span class="text-theme">⏳</span>
      {:else}
        <span>Export 4 Stems (Kick, Bass, Hats, Lead)</span>
        <span class="text-theme">↓</span>
      {/if}
    </button>
  </div>

  <div class="row xbetween ycenter bt pt-sm">
    <span class="text-secondary text-xs">
      {#if exportNotice}
        <span class="text-theme">{exportNotice}</span>
      {:else if midiDevices.length > 0}
        <span class="mono">MIDI: {midiDevices[0].name}</span>
      {:else}
        <span>OfflineAudioContext</span>
      {/if}
    </span>
    <span class="text-muted text-xs mono">44.1kHz Studio</span>
  </div>
</div>