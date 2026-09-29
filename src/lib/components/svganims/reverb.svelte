<script lang="ts">

	interface Props {
		width?: number,
		height?: number,
	}

	let { width = 100, height = 100 }: Props = $props()

</script>

<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height} fill="none">
  <polygon points="50,15 84,32 50,49 16,32" stroke="currentColor" stroke-width="0.6"></polygon>
  <polygon points="50,45 84,62 50,79 16,62" stroke="currentColor" stroke-width="0.6"></polygon>
  <line x1="16" y1="32" x2="16" y2="62" stroke="currentColor" stroke-width="0.6"></line>
  <line x1="84" y1="32" x2="84" y2="62" stroke="currentColor" stroke-width="0.6"></line>
  <line x1="50" y1="49" x2="50" y2="79" stroke="currentColor" stroke-width="0.6"></line>
  <polygon points="50,32 80,47 50,62 20,47" fill="var(--theme-color-dim)" stroke="var(--theme-color)" stroke-width="0.8"></polygon>
</svg>
