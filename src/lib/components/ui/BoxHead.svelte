<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		hasDot?: boolean;
		children?: Snippet;
	}

	let { title = "", hasDot = true, children }: Props = $props();

</script>

<header class="row xbetween ycenter">
	<span class="box-title">{title}</span>
	{#if children || hasDot}
		<div class="row ycenter gap-sm">
			{#if children}
				{@render children()}
			{/if}
			{#if hasDot}
				<span class="status-dot"></span>
			{/if}
		</div>
	{/if}
</header>