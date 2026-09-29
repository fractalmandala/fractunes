<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { layoutStore } from '$lib/stores/layoutStore.svelte';

  interface Props {
    id?: string;
    span?: string | number;
    min?: number;
    max?: number;
    centered?: boolean;
    class?: string;
    children: Snippet;
    onSpanChange?: (span: number, spanClass: string) => void;
  }

  let {
    id = undefined,
    span = $bindable("is-2-wide"),
    min = 2,
    max = 12,
    centered = false,
    class: className = "",
    children,
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

</script>

<section class="expandable-box {spanClass} {centered ? 'is-centered' : ''} {className}">
  <div class="grow">
    {@render children()}
  </div>
</section>