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
  <path d="M10 6h10" />
  <path d="M4 12h16" />
  <path d="M7 12h13" />
  <path d="M4 18h10" />
</svg>