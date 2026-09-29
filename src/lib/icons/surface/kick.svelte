<script lang="ts">

	interface Props {
		size?: number,
		fill?: string
	}

	let {
		size = 14, fill = "var(--text-muted)"
	}: Props = $props()

</script>

<svg width={size} height={size} viewBox="0 0 24 24"
  fill="none"
  stroke={fill}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M21 12c-6.597 0 -9 2.403 -9 9c0 -6.597 -2.403 -9 -9 -9c6.597 0 9 -2.403 9 -9c0 6.597 2.403 9 9 9" />
</svg>