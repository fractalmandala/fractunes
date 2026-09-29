<script lang="ts">

	import type { Snippet} from 'svelte'

	interface Props {
		size: number,
		children: Snippet
	}

	let {
		size = 14,
		children
	}: Props = $props()

</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  {@render children()}
</svg>