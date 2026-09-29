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
  <path d="M2 15h10v5h5v-5h5v-5h-10v-5h-5v5h-5l0 5" />
  <path d="M7 15v-5h5v5h5v-5" />
</svg>