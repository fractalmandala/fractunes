<script lang="ts">

	interface Props {
		width?: number | string,
		height?: number | string,
	}

	let { width = "100%", height = 60 }: Props = $props()

</script>

<svg class="svg-anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 60" width={width} height={height} fill="none">
  <path d="M 5,30 Q 37,-10 70,30 T 135,30" stroke="currentColor" stroke-width="1.2"></path>
</svg>
