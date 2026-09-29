<script lang="ts">
  import { synthStore } from "$lib/stores/synthStore.svelte";
  import ParamDrag from "$lib/components/ParamDrag.svelte";
	import ExpandableBox from "../ExpandableBox.svelte";
  import Head from "$lib/components/ui/BoxHead.svelte";

  const rowLabels = ["Kick", "Bass", "Hat Cl", "Hat Op"];
</script>

<ExpandableBox centered span="is-6-wide">
  <Head title="KBBB Sequencer" hasDot={true}>
    <span class="text-secondary text-xs mono">
      16-Step Rolling Gal-Op
    </span>
  </Head>

  <div class="box gap-xs my-auto">
    {#each [0, 1, 2, 3] as t}
      <div class="row ycenter gap-sm">
        <span class="w48 text-secondary text-xs mono">
          {rowLabels[t]}
        </span>
        <div class="row grow gap-3xs">
          {#each Array(16) as _, s}
            {@const isActive = synthStore.pattern[t][s] === 1}
            {@const isDownbeat = s % 4 === 0}
            {@const isCurrent = synthStore.currentStep === s}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="seq-pad grow row xcenter ycenter"
              class:active={isActive}
              class:is-downbeat={isDownbeat}
              class:current={isCurrent}
              onclick={() => synthStore.toggleStep(t, s)}
            >
              <span class="seq-dot radius-full"></span>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="row xbetween ycenter bt pt-sm">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      onclick={() => synthStore.resetPattern()}
    >
      Reset Pattern
    </span>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      onclick={() => synthStore.clearPattern()}
    >
      Clear
    </span>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      title="Toggle pattern slot A/B"
      onclick={() => synthStore.toggleSlot()}
    >
      Slot {synthStore.activeSlot}
    </span>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      title="One-bar drum fill"
      onclick={() => synthStore.armFill()}
    >
      {synthStore.fillArmed ? "Fill: ON" : "Fill"}
    </span>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      title="Bass octave jump on step 14"
      onclick={() => synthStore.toggleBassOctave()}
    >
      Bass 8va: {synthStore.bassOctave ? "ON" : "OFF"}
    </span>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="text-secondary text-xs mono cursor-pointer"
      title="Lead octave -1/0/+1"
      onclick={() => synthStore.cycleLeadOctave()}
    >
      Lead 8va: {synthStore.leadOctave > 0 ? "+" + synthStore.leadOctave : synthStore.leadOctave}
    </span>

    <div class="box">
      <div class="text-secondary text-xs">Swing</div>
      <ParamDrag
        bind:value={synthStore.swing}
        min={0}
        max={0.5}
        step={0.01}
        sensitivity={0.4}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(v) => synthStore.setSwing(v)}
      />
    </div>
  </div>
</ExpandableBox>
