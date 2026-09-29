<script lang="ts">
	import {
		GridLayout,
		createContainerWidth,
		type Layout,
		type LayoutItem
	} from '@snapgridjs/svelte';
	import { motion, AnimatePresence } from '@humanspeak/svelte-motion';
	import {
		SPRING_HEAVY_TILE,
		SPRING_HEAVY_RESIZE,
		SPRING_PRESS,
		EASE_OUT
	} from '$lib/stores/ease.js';
	import { AdaptiveCompactor, collides } from './compactor';

	// Sample Categories & Metadata
	type SampleCategory =
		'kick' | 'bass' | 'hat-cl' | 'hat-op' | 'lead' | 'snare' | 'zap' | 'glitch' | 'sub' | 'pad';

	interface SampleMetadata {
		name: string;
		category: SampleCategory;
		tag: string;
		color: string;
		freq: number;
		decay: number;
	}

	const CATEGORY_COLORS: Record<SampleCategory, string> = {
		kick: '#e85526',
		bass: '#19b62e',
		'hat-cl': '#f59e0b',
		'hat-op': '#fbbf24',
		lead: '#38bdf8',
		snare: '#ec4899',
		zap: '#a855f7',
		glitch: '#6366f1',
		sub: '#14b8a6',
		pad: '#8b5cf6'
	};

	const DEFAULT_META: Record<string, SampleMetadata> = {
		'sample-kick': {
			name: 'Morning Kick',
			category: 'kick',
			tag: 'KICK',
			color: CATEGORY_COLORS.kick,
			freq: 150,
			decay: 0.18
		},
		'sample-bass': {
			name: 'Gal-Op Bass',
			category: 'bass',
			tag: 'BASS',
			color: CATEGORY_COLORS.bass,
			freq: 55,
			decay: 0.22
		},
		'sample-hat-cl': {
			name: '16th Tick',
			category: 'hat-cl',
			tag: 'HAT',
			color: CATEGORY_COLORS['hat-cl'],
			freq: 8000,
			decay: 0.05
		},
		'sample-hat-op': {
			name: '909 Open Hat',
			category: 'hat-op',
			tag: 'OHAT',
			color: CATEGORY_COLORS['hat-op'],
			freq: 6000,
			decay: 0.28
		},
		'sample-acid': {
			name: '303 Resonant',
			category: 'lead',
			tag: 'ACID',
			color: CATEGORY_COLORS.lead,
			freq: 220,
			decay: 0.35
		},
		'sample-snare': {
			name: 'Gated Snare',
			category: 'snare',
			tag: 'SNAR',
			color: CATEGORY_COLORS.snare,
			freq: 240,
			decay: 0.2
		},
		'sample-glitch': {
			name: 'Vocal Chop',
			category: 'glitch',
			tag: 'GLCH',
			color: CATEGORY_COLORS.glitch,
			freq: 440,
			decay: 0.15
		},
		'sample-zap': {
			name: 'Laser Riser',
			category: 'zap',
			tag: 'ZAP',
			color: CATEGORY_COLORS.zap,
			freq: 900,
			decay: 0.4
		},
		'sample-lead': {
			name: 'Astrix Saw',
			category: 'lead',
			tag: 'LEAD',
			color: CATEGORY_COLORS.lead,
			freq: 330,
			decay: 0.45
		},
		'sample-sub': {
			name: '40Hz Sine Boom',
			category: 'sub',
			tag: 'SUB',
			color: CATEGORY_COLORS.sub,
			freq: 42,
			decay: 0.6
		},
		'sample-pad': {
			name: 'Astral Sphere',
			category: 'pad',
			tag: 'PAD',
			color: CATEGORY_COLORS.pad,
			freq: 196,
			decay: 0.9
		}
	};

	const DEFAULT_LAYOUT: LayoutItem[] = [
		{ i: 'sample-kick', x: 0, y: 0, w: 2, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-bass', x: 2, y: 0, w: 3, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-hat-cl', x: 5, y: 0, w: 1, h: 1, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-hat-op', x: 5, y: 1, w: 1, h: 1, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-acid', x: 6, y: 0, w: 3, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-snare', x: 9, y: 0, w: 3, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-glitch', x: 0, y: 2, w: 2, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-zap', x: 2, y: 2, w: 2, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-lead', x: 4, y: 2, w: 4, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-sub', x: 8, y: 2, w: 4, h: 2, minW: 1, maxW: 12, minH: 1, maxH: 8 },
		{ i: 'sample-pad', x: 0, y: 4, w: 12, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 8 }
	];

	// Grid State
	const container = createContainerWidth({ initialWidth: 1280 });
	const samplingCompactor = new AdaptiveCompactor({ cols: 12, maxRows: 8 });
	samplingCompactor.setCommitted(DEFAULT_LAYOUT);

	let layout = $state<LayoutItem[]>(DEFAULT_LAYOUT);
	let sampleMeta = $state<Record<string, SampleMetadata>>({ ...DEFAULT_META });
	let rowHeight = $state<number>(76);
	let activePlaying = $state<Record<string, boolean>>({});

	// Web Audio Context & Synthesizer Engine
	let audioCtx: AudioContext | null = null;

	function getAudio(): AudioContext {
		if (!audioCtx) {
			const AudioCtx =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			audioCtx = new AudioCtx();
		}
		if (audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
		return audioCtx;
	}

	function triggerSample(id: string) {
		const meta = sampleMeta[id];
		if (!meta) return;

		// Flash UI pulse
		activePlaying[id] = true;
		setTimeout(
			() => {
				activePlaying[id] = false;
			},
			Math.min(400, meta.decay * 1000)
		);

		try {
			const ctx = getAudio();
			const now = ctx.currentTime;

			if (meta.category === 'kick') {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sine';
				osc.frequency.setValueAtTime(meta.freq, now);
				osc.frequency.exponentialRampToValueAtTime(38, now + meta.decay);
				gain.gain.setValueAtTime(1.0, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + meta.decay);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + meta.decay);
			} else if (meta.category === 'bass' || meta.category === 'sub') {
				const osc = ctx.createOscillator();
				const filter = ctx.createBiquadFilter();
				const gain = ctx.createGain();
				osc.type = meta.category === 'sub' ? 'sine' : 'sawtooth';
				osc.frequency.setValueAtTime(meta.freq, now);
				filter.type = 'lowpass';
				filter.frequency.setValueAtTime(meta.category === 'sub' ? 120 : 600, now);
				filter.frequency.exponentialRampToValueAtTime(60, now + meta.decay);
				gain.gain.setValueAtTime(0.8, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + meta.decay);
				osc.connect(filter);
				filter.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + meta.decay);
			} else if (
				meta.category === 'hat-cl' ||
				meta.category === 'hat-op' ||
				meta.category === 'snare'
			) {
				const bufferSize = Math.max(128, Math.floor(ctx.sampleRate * meta.decay));
				const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
				const data = buffer.getChannelData(0);
				for (let i = 0; i < bufferSize; i++) {
					data[i] = Math.random() * 2 - 1;
				}
				const noise = ctx.createBufferSource();
				noise.buffer = buffer;
				const filter = ctx.createBiquadFilter();
				filter.type = meta.category === 'snare' ? 'bandpass' : 'highpass';
				filter.frequency.setValueAtTime(meta.freq, now);
				const gain = ctx.createGain();
				gain.gain.setValueAtTime(0.7, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + meta.decay);
				noise.connect(filter);
				filter.connect(gain);
				gain.connect(ctx.destination);
				noise.start(now);
			} else {
				// Leads, Zaps, Glitches, Pads
				const osc = ctx.createOscillator();
				const filter = ctx.createBiquadFilter();
				const gain = ctx.createGain();
				osc.type = meta.category === 'pad' ? 'triangle' : 'sawtooth';
				osc.frequency.setValueAtTime(meta.freq, now);
				if (meta.category === 'zap') {
					osc.frequency.exponentialRampToValueAtTime(100, now + meta.decay);
				}
				filter.type = 'lowpass';
				filter.frequency.setValueAtTime(1800, now);
				filter.Q.setValueAtTime(6, now);
				gain.gain.setValueAtTime(0.6, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + meta.decay);
				osc.connect(filter);
				filter.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + meta.decay);
			}
		} catch {
			// AudioContext unavailable or blocked
		}
	}

	let activeDraggingId = $state<string | null>(null);
	let activeResizingId = $state<string | null>(null);

	function handleLayoutChange(newLayout: Layout) {
		layout = [...newLayout];
		samplingCompactor.setCommitted(newLayout);
	}

	function handleDragStart(currentLayout: Layout, oldItem: LayoutItem | null) {
		samplingCompactor.onDragStart(currentLayout, oldItem);
		activeDraggingId = oldItem?.i ?? null;
	}

	function handleDragStop() {
		samplingCompactor.onDragStop();
		activeDraggingId = null;
	}

	function handleResizeStart(currentLayout: Layout, oldItem: LayoutItem | null) {
		samplingCompactor.onResizeStart(currentLayout, oldItem);
		activeResizingId = oldItem?.i ?? null;
	}

	function handleResizeStop() {
		samplingCompactor.onResizeStop();
		activeResizingId = null;
	}

	function removeTile(id: string, e: MouseEvent) {
		e.stopPropagation();
		const nextLayout = layout.filter((item) => item.i !== id);
		layout = nextLayout;
		samplingCompactor.setCommitted(nextLayout);
		const updated = { ...sampleMeta };
		delete updated[id];
		sampleMeta = updated;
	}

	let nextTileIdx = $state(1);
	function addTile() {
		if (totalOccupiedCells >= 96) return;

		const categories: SampleCategory[] = [
			'kick',
			'bass',
			'lead',
			'hat-cl',
			'hat-op',
			'snare',
			'zap',
			'glitch',
			'sub',
			'pad'
		];
		const cat = categories[Math.floor(Math.random() * categories.length)];
		const id = `sample-custom-${Date.now()}-${nextTileIdx++}`;

		// Find first free slot for 2x2, or 1x1 to prevent initial overlap
		let placedX = -1;
		let placedY = -1;
		let placedW = 2;
		let placedH = 2;

		for (let r = 0; r <= 6; r++) {
			for (let c = 0; c <= 10; c++) {
				const testItem: LayoutItem = {
					i: id,
					x: c,
					y: r,
					w: 2,
					h: 2,
					minW: 1,
					maxW: 12,
					minH: 1,
					maxH: 8
				};
				if (!layout.some((other) => collides(testItem, other))) {
					placedX = c;
					placedY = r;
					break;
				}
			}
			if (placedX !== -1) break;
		}

		if (placedX === -1) {
			placedW = 1;
			placedH = 1;
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 12; c++) {
					const testItem: LayoutItem = {
						i: id,
						x: c,
						y: r,
						w: 1,
						h: 1,
						minW: 1,
						maxW: 12,
						minH: 1,
						maxH: 8
					};
					if (!layout.some((other) => collides(testItem, other))) {
						placedX = c;
						placedY = r;
						break;
					}
				}
				if (placedX !== -1) break;
			}
		}

		if (placedX === -1) return;

		sampleMeta[id] = {
			name: `Custom ${cat.toUpperCase()}`,
			category: cat,
			tag: cat.slice(0, 4).toUpperCase(),
			color: CATEGORY_COLORS[cat],
			freq: cat === 'kick' ? 140 : cat === 'bass' ? 55 : 350,
			decay: 0.3
		};

		const nextLayout: LayoutItem[] = [
			...layout,
			{
				i: id,
				x: placedX,
				y: placedY,
				w: placedW,
				h: placedH,
				minW: 1,
				maxW: 12,
				minH: 1,
				maxH: 8
			}
		];
		layout = nextLayout;
		samplingCompactor.setCommitted(nextLayout);
	}

	function setPreset(type: 'default' | 'full96' | 'single12' | 'quad') {
		if (type === 'default') {
			layout = DEFAULT_LAYOUT;
			sampleMeta = { ...DEFAULT_META };
			samplingCompactor.setCommitted(DEFAULT_LAYOUT);
		} else if (type === 'full96') {
			// 1 Tile = Size 12x8 = 96 Cells Maximum
			const newLayout: LayoutItem[] = [
				{
					i: 'sample-master-96',
					x: 0,
					y: 0,
					w: 12,
					h: 8,
					minW: 1,
					maxW: 12,
					minH: 1,
					maxH: 8
				}
			];
			layout = newLayout;
			sampleMeta = {
				'sample-master-96': {
					name: 'Master Psytrance Surface',
					category: 'lead',
					tag: '96 CELL',
					color: '#38bdf8',
					freq: 260,
					decay: 0.8
				}
			};
			samplingCompactor.setCommitted(newLayout);
		} else if (type === 'single12') {
			// 12 single 1x1 cells across row 0
			const cats: SampleCategory[] = [
				'kick',
				'bass',
				'hat-cl',
				'hat-op',
				'snare',
				'zap',
				'glitch',
				'sub',
				'lead',
				'pad',
				'kick',
				'hat-cl'
			];
			const newLayout: LayoutItem[] = [];
			const newMeta: Record<string, SampleMetadata> = {};
			cats.forEach((cat, idx) => {
				const id = `cell-1x1-${idx}`;
				newLayout.push({
					i: id,
					x: idx,
					y: 0,
					w: 1,
					h: 1,
					minW: 1,
					maxW: 12,
					minH: 1,
					maxH: 8
				});
				newMeta[id] = {
					name: `${cat.toUpperCase()} #${idx + 1}`,
					category: cat,
					tag: String(idx + 1).padStart(2, '0'),
					color: CATEGORY_COLORS[cat],
					freq: 100 + idx * 40,
					decay: 0.2
				};
			});
			layout = newLayout;
			sampleMeta = newMeta;
			samplingCompactor.setCommitted(newLayout);
		} else if (type === 'quad') {
			// 4 large 6x4 tiles
			const newLayout: LayoutItem[] = [
				{ i: 'quad-1', x: 0, y: 0, w: 6, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 8 },
				{ i: 'quad-2', x: 6, y: 0, w: 6, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 8 },
				{ i: 'quad-3', x: 0, y: 4, w: 6, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 8 },
				{ i: 'quad-4', x: 6, y: 4, w: 6, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 8 }
			];
			layout = newLayout;
			sampleMeta = {
				'quad-1': {
					name: 'Rhythm Deck A',
					category: 'kick',
					tag: 'RHYTHM',
					color: CATEGORY_COLORS.kick,
					freq: 140,
					decay: 0.25
				},
				'quad-2': {
					name: 'Bassline Deck',
					category: 'bass',
					tag: 'BASS',
					color: CATEGORY_COLORS.bass,
					freq: 55,
					decay: 0.3
				},
				'quad-3': {
					name: 'Lead Acid Deck',
					category: 'lead',
					tag: 'ACID',
					color: CATEGORY_COLORS.lead,
					freq: 300,
					decay: 0.4
				},
				'quad-4': {
					name: 'Atmosphere & FX',
					category: 'pad',
					tag: 'SPACE',
					color: CATEGORY_COLORS.pad,
					freq: 200,
					decay: 0.7
				}
			};
			samplingCompactor.setCommitted(newLayout);
		}
	}

	// Calculated Stats
	const totalOccupiedCells = $derived(layout.reduce((acc, it) => acc + it.w * it.h, 0));
</script>

<div class="sampling-workspace">
	<!-- Top Control Toolbar -->
	<header class="sampling-toolbar">
		<div class="row ycenter gap-sm">
			<span class="mono text-xs text-primary weight-600">12 × 8 SAMPLING MATRIX</span>
			<span class="text-xs text-muted mono">
				{layout.length} Tiles · {totalOccupiedCells}/96 Cells Used
			</span>
			<span class="text-xs text-secondary mono" style:opacity="0.8">
				[Auto-Shrink: ON · Zero Overlap]
			</span>
		</div>

		<div class="row ycenter gap-xs">
			<motion.button
				type="button"
				data-variant="small"
				data-shape="modern"
				whileTap={{ scale: 0.96 }}
				transition={SPRING_PRESS}
				onclick={addTile}
				disabled={totalOccupiedCells >= 96}
				title="Add new sampling tile"
			>
				+ Add Tile
			</motion.button>

			<!-- Layout Presets -->
			<motion.button
				type="button"
				data-variant="small"
				data-shape="modern"
				whileTap={{ scale: 0.96 }}
				transition={SPRING_PRESS}
				onclick={() => setPreset('default')}
			>
				Default
			</motion.button>
			<motion.button
				type="button"
				data-variant="small"
				data-shape="modern"
				whileTap={{ scale: 0.96 }}
				transition={SPRING_PRESS}
				onclick={() => setPreset('full96')}
				title="1 Tile = 12x8 = 96 Cells"
			>
				Max 96 Cells (12×8)
			</motion.button>
			<motion.button
				type="button"
				data-variant="small"
				data-shape="modern"
				whileTap={{ scale: 0.96 }}
				transition={SPRING_PRESS}
				onclick={() => setPreset('single12')}
				title="12x 1-Cell Tiles"
			>
				Min 1 Cell (1×1)
			</motion.button>
			<motion.button
				type="button"
				data-variant="small"
				data-shape="modern"
				whileTap={{ scale: 0.96 }}
				transition={SPRING_PRESS}
				onclick={() => setPreset('quad')}
				title="Quad 6x4 Decks"
			>
				Quad
			</motion.button>

			<!-- Row Height Scale -->
			<div class="row ycenter gap-2xs ml-xs">
				<span class="text-xs text-muted mono">Row</span>
				<motion.button
					type="button"
					data-variant="icon-mini"
					whileTap={{ scale: 0.9 }}
					transition={SPRING_PRESS}
					disabled={rowHeight <= 50}
					onclick={() => (rowHeight = Math.max(50, rowHeight - 8))}
					title="Decrease Row Height"
				>
					-
				</motion.button>
				<span class="text-xs text-secondary mono">{rowHeight}px</span>
				<motion.button
					type="button"
					data-variant="icon-mini"
					whileTap={{ scale: 0.9 }}
					transition={SPRING_PRESS}
					disabled={rowHeight >= 120}
					onclick={() => (rowHeight = Math.min(120, rowHeight + 8))}
					title="Increase Row Height"
				>
					+
				</motion.button>
			</div>
		</div>
	</header>

	<!-- Interactive Grid Area -->
	<div {@attach container.attach} class="sampling-grid-wrapper">
		{#if container.width > 0}
			<!-- Visual 12x8 Matrix Backdrop Guide -->
			<div
				class="sampling-grid-backdrop"
				style:grid-template-rows="repeat(8, {rowHeight}px)"
				style:height="{8 * rowHeight + 7 * 8}px"
			>
				{#each Array.from({ length: 96 }, (_, i) => i) as idx (idx)}
					{@const col = (idx % 12) + 1}
					{@const row = Math.floor(idx / 12) + 1}
					<div class="sampling-cell-guide" style:height="{rowHeight}px">
						<span>C{col}:R{row}</span>
					</div>
				{/each}
			</div>

			<!-- SnapGrid Svelte Component with Adaptive Auto-Shrink Compactor -->
			<GridLayout
				width={container.width}
				{layout}
				onLayoutChange={handleLayoutChange}
				onResizeStart={handleResizeStart}
				onResizeStop={handleResizeStop}
				onDragStart={handleDragStart}
				onDragStop={handleDragStop}
				gridConfig={{
					cols: 12,
					maxRows: 8,
					rowHeight,
					margin: [8, 8],
					containerPadding: [8, 8]
				}}
				resizeConfig={{
					enabled: true,
					handles: ['se', 's', 'e']
				}}
				dragConfig={{
					enabled: true,
					bounded: true,
					threshold: 3
				}}
				compactor={samplingCompactor}
				isDraggable={true}
				isResizable={true}
			>
				{#snippet item(item: LayoutItem)}
					{@const meta = sampleMeta[item.i] ?? {
						name: `Sample ${item.i}`,
						category: 'lead',
						tag: 'SMPL',
						color: '#38bdf8',
						freq: 220,
						decay: 0.3
					}}
					{@const cellCount = item.w * item.h}
					{@const isPlaying = activePlaying[item.i]}
					{@const isDragging = activeDraggingId === item.i}
					{@const isResizing = activeResizingId === item.i}

					<motion.div
						class={['sampling-tile', isPlaying && 'is-playing', isDragging && 'is-dragging', isResizing && 'is-resizing'].filter(Boolean).join(' ')}
						style="border-left: 3px solid {meta.color};"
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{
							opacity: 1,
							scale: isDragging ? 1.025 : 1,
							y: isDragging ? -3 : 0,
							boxShadow: isDragging
								? '0 24px 48px -6px rgba(0, 0, 0, 0.75), 0 10px 20px -3px rgba(0, 0, 0, 0.5), 0 0 0 1.5px ' + meta.color
								: isResizing
									? 'inset 0 0 14px rgba(25, 182, 46, 0.2), 0 14px 28px rgba(0, 0, 0, 0.5), 0 0 0 1.5px ' + meta.color
									: '0 2px 6px rgba(0, 0, 0, 0.25)'
						}}
						transition={isDragging ? SPRING_HEAVY_TILE : SPRING_HEAVY_RESIZE}
						whileHover={{
							y: isDragging ? -3 : -1,
							transition: { duration: 0.15, ease: EASE_OUT }
						}}
					>
						{#if isResizing}
							<motion.div
								class="sampling-tile-hud"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={SPRING_HEAVY_RESIZE}
							>
								<span class="mono weight-600">{item.w}×{item.h}</span>
								<span class="mono text-muted">[{cellCount}c]</span>
							</motion.div>
						{/if}

						<!-- Drag Header -->
						<div class="sampling-tile-header">
							<div class="row ycenter gap-2xs">
								<span class="sampling-tag" style:color={meta.color}>
									{meta.tag}
								</span>
								<span class="mono text-xs text-muted">
									{item.w}×{item.h} ({cellCount})
								</span>
							</div>

							<div class="row ycenter gap-3xs">
								<motion.button
									type="button"
									data-variant="icon-mini"
									whileTap={{ scale: 0.85 }}
									transition={SPRING_PRESS}
									onclick={(e: MouseEvent) => removeTile(item.i, e)}
									title="Remove Tile"
									aria-label="Remove Tile"
								>
									✕
								</motion.button>
							</div>
						</div>

						<!-- Tile Body: Click to Trigger Sound -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="sampling-tile-body" onclick={() => triggerSample(item.i)}>
							<div class="box">
								<span class="text-xs text-primary weight-600 truncate">
									{meta.name}
								</span>
								<span class="text-xs text-muted mono">
									pos [{item.x}, {item.y}]
								</span>
							</div>

							{#if item.w >= 2 && item.h >= 2}
								<div class="sampling-spectrum">
									{#each Array.from({ length: Math.min(24, item.w * 3) }, (_, bIdx) => bIdx) as barIdx (barIdx)}
										{@const barHeight = isPlaying
											? Math.min(100, 25 + Math.sin(barIdx * 0.8) * 35 + (barIdx % 3) * 20)
											: Math.min(100, 15 + Math.sin((barIdx + (meta.freq % 10)) * 0.5) * 15 + (barIdx % 2) * 8)}
										<div
											class="sampling-spectrum-bar"
											style:height="{barHeight}%"
											style:background-color={isPlaying ? meta.color : 'var(--border-strong)'}
										></div>
									{/each}
								</div>
							{/if}

							<div class="row xbetween ycenter">
								<motion.button
									type="button"
									data-variant="small"
									data-shape="modern"
									class="mono text-xs"
									style="color: {meta.color};"
									whileTap={{ scale: 0.94 }}
									transition={SPRING_PRESS}
									onclick={(e: MouseEvent) => {
										e.stopPropagation();
										triggerSample(item.i);
									}}
								>
									{isPlaying ? '▶ PLAYING' : '▶ TRIG'}
								</motion.button>

								{#if item.w >= 2}
									<span class="text-xs text-secondary mono">
										{Math.round(meta.freq)}Hz
									</span>
								{/if}
							</div>
						</div>
					</motion.div>
				{/snippet}
			</GridLayout>
		{/if}
	</div>
</div>
