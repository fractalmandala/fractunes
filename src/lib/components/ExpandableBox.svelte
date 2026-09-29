<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { MotionSection } from '@humanspeak/svelte-motion';
  import { layoutStore } from '$lib/stores/layoutStore.svelte';
	import ExpandIcon from '$lib/icons/expand.svelte'
	import ContractIcon from '$lib/icons/collapse.svelte'
	import MaxIcon from '$lib/icons/maximize.svelte'
	import MinIcon from '$lib/icons/minimize.svelte'

  interface Props {
    id?: string;
    span?: string | number;
    min?: number;
    max?: number;
    step?: number;
    transition?: any;
    centered?: boolean;
    showControls?: boolean;
    title?: string;
    class?: string;
    header?: Snippet;
    controls?: Snippet<[{
      span: number;
      spanClass: string;
      expand: () => void;
      contract: () => void;
      canExpand: boolean;
      canContract: boolean;
    }]>;
    children: Snippet;
    onSpanChange?: (span: number, spanClass: string) => void;
  }

  let {
    id = undefined,
    span = $bindable("is-2-wide"),
    min = 2,
    max = 12,
    step = 1,
    transition = { type: "spring", stiffness: 350, damping: 30 },
    centered = false,
    showControls = true,
    title = undefined,
    class: className = "",
    header,
    controls,
    children,
    onSpanChange
  }: Props = $props();

  function parseNumeric(val: string | number | undefined, fallback: number): number {
    if (typeof val === 'number') return Math.max(min, Math.min(max, Math.round(val)));
    if (typeof val === 'string') {
      const match = val.match(/\d+/);
      if (match) {
        const n = parseInt(match[0], 10);
        return Math.max(min, Math.min(max, n));
      }
    }
    return fallback;
  }

  // Internal reactive numeric span
  let currentSpan = $state<number>(2);

  $effect.pre(() => {
    currentSpan = parseNumeric(span, min);
  });

  // Derived span class name & states
  let spanClass = $derived(`is-${currentSpan}-wide`);
  let canExpand = $derived(currentSpan < max);
  let canContract = $derived(currentSpan > min);

  // Sync to bindable span prop
  $effect(() => {
    if (typeof span === 'number') {
      if (span !== currentSpan) span = currentSpan;
    } else {
      if (span !== spanClass) span = spanClass;
    }
  });

  onMount(() => {
    if (id) {
      const saved = layoutStore.get(id, -1);
      if (saved >= min && saved <= max) {
        currentSpan = saved;
      } else {
        layoutStore.set(id, currentSpan, min, max);
      }
    }
  });

  function updateSpan(newVal: number) {
    const clamped = Math.max(min, Math.min(max, newVal));
    if (clamped !== currentSpan) {
      currentSpan = clamped;
      if (id) {
        layoutStore.set(id, clamped, min, max);
      }
      onSpanChange?.(currentSpan, `is-${currentSpan}-wide`);
    }
  }

  function expand() {
    updateSpan(currentSpan + step);
  }

  function contract() {
    updateSpan(currentSpan - step);
  }

	function maximize() {
		updateSpan(12)
	}

	function minimize() {
		updateSpan(2)
	}
</script>

<MotionSection
  layout
  {transition}
  class="expandable-box grow {spanClass} {centered ? 'is-centered' : ''} {className}"
>
  {#if showControls || header || title}
    <header class="row ycenter xbetween">
      {#if header}
        {@render header()}
      {:else if title}
        <span class="box-title text-sm">{title}</span>
      {:else}
        <span></span>
      {/if}

      {#if showControls}
        {#if controls}
          {@render controls({
            span: currentSpan,
            spanClass,
            expand,
            contract,
            canExpand,
            canContract
          })}
        {:else}
          <div class="row gap-3xs">
						{#if span !== "is-2-wide"}
						<button type="button" data-variant="icon-mini" onclick={minimize}><MinIcon/></button>
            <button
              type="button"
              data-variant="icon-mini"
              onclick={contract}
              disabled={!canContract}
              title="Contract width (-)"
              aria-label="Contract width"
            >
              <ContractIcon/>
            </button>
						{/if}
						{#if span !== "is-12-wide"}
            <button
              type="button"
              data-variant="icon-mini"
              onclick={expand}
              disabled={!canExpand}
              title="Expand width (+)"
              aria-label="Expand width"
            >
              <ExpandIcon/>
            </button>
						<button type="button" data-variant="icon-mini" onclick={maximize}><MaxIcon/></button>
						{/if}
          </div>
        {/if}
      {/if}
    </header>
  {/if}

  <div class="grow">
    {@render children()}
  </div>
</MotionSection>