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
  <path d="M2 12h9" />
  <path d="M15 12h7" />
  <path d="M11 5v14" />
  <path d="M15 9v6" />
  <path d="M3 5h4" />
  <path d="M5 3v4" />
</svg>