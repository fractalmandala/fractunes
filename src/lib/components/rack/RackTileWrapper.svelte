<script lang="ts">
	import type { Snippet } from 'svelte';
	import { motion } from '@humanspeak/svelte-motion';
	import { SPRING_HEAVY_TILE, SPRING_HEAVY_RESIZE } from '$lib/stores/ease.js';

	interface Props {
		id: string;
		isDragging?: boolean;
		isResizing?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		id,
		isDragging = false,
		isResizing = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<motion.div
	data-rack-tile={id}
	class={['rack-tile-wrapper', isDragging && 'is-dragging', isResizing && 'is-resizing', className].filter(Boolean).join(' ')}
	animate={{
		scale: isDragging ? 1.015 : 1,
		y: isDragging ? -2 : 0
	}}
	transition={isDragging ? SPRING_HEAVY_TILE : SPRING_HEAVY_RESIZE}
>
	{@render children()}
</motion.div>
