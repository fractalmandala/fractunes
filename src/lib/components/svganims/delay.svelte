<script lang="ts">

	interface Props {
		width?: number,
		height?: number,
	}

	let { width = 110, height = 110 }: Props = $props()

</script>

<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 110 110" width={width} height={height}>
  <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="1"></circle>
  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="1"></circle>
  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1"></circle>
  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--theme-color)" stroke-width="1.2"></circle>
  <circle cx="50" cy="50" r="2" fill="var(--theme-color-high)"></circle>
</svg>