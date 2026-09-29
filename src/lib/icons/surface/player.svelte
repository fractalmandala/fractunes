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
  <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
  <path d="M9 13h-2" />
  <path d="M13 10h-6" />
  <path d="M11 7h-4" />
</svg>