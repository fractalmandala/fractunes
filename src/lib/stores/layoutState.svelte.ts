/**
 * Svelte 5 Reactive Layout State for the Fractunes Rack Grid.
 * Manages 12-column × 8-row layout, fluid height calculation, compactor lifecycle,
 * drag/resize sessions, and persistence.
 */

import type { Layout, LayoutItem } from '@snapgridjs/svelte';
import { AdaptiveCompactor, cloneLayout } from './compactor';

export const DEFAULT_RACK_LAYOUT: LayoutItem[] = [
	// Shelf 1 (y: 0, h: 2): Mixer (3), Player/Transport (6), Stems (3)
	{ i: 'mixer', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'player', x: 3, y: 0, w: 6, h: 2, minW: 3, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'stems', x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },

	// Shelf 2 (y: 2, h: 2): Kick (3), Drums/Hats (3), Wavetable (3), Filters (3)
	{ i: 'kick', x: 0, y: 2, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'drums', x: 3, y: 2, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'wavetable', x: 6, y: 2, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'filters', x: 9, y: 2, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },

	// Shelf 3 (y: 4, h: 2): Delay (3), Reverb (3), Modulator A (3), Modulator B (3)
	{ i: 'delay', x: 0, y: 4, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'reverb', x: 3, y: 4, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'modulatorA', x: 6, y: 4, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },
	{ i: 'modulatorB', x: 9, y: 4, w: 3, h: 2, minW: 2, maxW: 12, minH: 1, maxH: 8 },

	// Shelf 4 (y: 6, h: 2): Sequencer (12)
	{ i: 'sequencer', x: 0, y: 6, w: 12, h: 2, minW: 4, maxW: 12, minH: 1, maxH: 8 }
];

const STORAGE_KEY = 'fractunes:rack-grid-layout';

export class LayoutState {
	readonly cols = 12;
	readonly rows = 8;
	readonly marginX = 24;
	readonly marginY = 24;
	readonly minRowHeight = 50;

	compactor: AdaptiveCompactor;

	layout = $state<LayoutItem[]>(DEFAULT_RACK_LAYOUT);
	containerWidth = $state<number>(1200);
	containerHeight = $state<number>(720);
	containerMounted = $state<boolean>(false);

	activeDraggingId = $state<string | null>(null);
	activeResizingId = $state<string | null>(null);

	constructor() {
		this.compactor = new AdaptiveCompactor({ cols: this.cols, maxRows: this.rows });
		const initial = this.loadPersistedLayout();
		this.layout = initial;
		this.compactor.setCommitted(initial);
	}

	/**
	 * Fluid Row Height: dynamically derived so that all 8 rows precisely fill 1/8 of available height.
	 */
	get rowHeight(): number {
		const available = this.containerHeight - (this.rows - 1) * this.marginY;
		return Math.max(this.minRowHeight, Math.floor(available / this.rows));
	}

	get gridConfig() {
		return {
			cols: this.cols,
			maxRows: this.rows,
			rowHeight: this.rowHeight,
			margin: [this.marginX, this.marginY] as [number, number],
			containerPadding: [0, 0] as [number, number]
		};
	}

	/**
	 * Returns true if the current layout deviates in position or dimensions from DEFAULT_RACK_LAYOUT.
	 */
	get isAltered(): boolean {
		if (this.layout.length !== DEFAULT_RACK_LAYOUT.length) return true;
		const defaultMap = new Map(DEFAULT_RACK_LAYOUT.map((it) => [it.i, it]));
		return this.layout.some((it) => {
			const def = defaultMap.get(it.i);
			if (!def) return true;
			return it.x !== def.x || it.y !== def.y || it.w !== def.w || it.h !== def.h;
		});
	}

	private loadPersistedLayout(): LayoutItem[] {
		if (typeof window === 'undefined') return cloneLayout(DEFAULT_RACK_LAYOUT);
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length === DEFAULT_RACK_LAYOUT.length) {
					const defaultIds = new Set(DEFAULT_RACK_LAYOUT.map((it) => it.i));
					const allMatch = parsed.every((it) => defaultIds.has(it.i));
					if (allMatch) {
						return parsed;
					}
				}
			}
		} catch {}
		return cloneLayout(DEFAULT_RACK_LAYOUT);
	}

	/**
	 * Svelte 5 attachment directive to dynamically observe container dimensions.
	 */
	attach = (node: HTMLElement) => {
		if (typeof ResizeObserver === 'undefined') return () => {};
		const measure = () => {
			const rect = node.getBoundingClientRect();
			if (rect.width > 0) this.containerWidth = Math.floor(rect.width);
			if (rect.height > 0) this.containerHeight = Math.floor(rect.height);
			this.containerMounted = true;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	};

	handleLayoutChange = (newLayout: Layout) => {
		this.layout = newLayout as LayoutItem[];
		this.compactor.setCommitted(newLayout);
		try {
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
			}
		} catch {}
	};

	handleDragStart = (currentLayout: Layout, oldItem: LayoutItem | null) => {
		this.compactor.onDragStart(currentLayout, oldItem);
		this.activeDraggingId = oldItem?.i ?? null;
	};

	handleDragStop = () => {
		this.compactor.onDragStop();
		this.activeDraggingId = null;
	};

	handleResizeStart = (currentLayout: Layout, oldItem: LayoutItem | null) => {
		this.compactor.onResizeStart(currentLayout, oldItem);
		this.activeResizingId = oldItem?.i ?? null;
	};

	handleResizeStop = () => {
		this.compactor.onResizeStop();
		this.activeResizingId = null;
	};

	resetLayout = () => {
		const fresh = cloneLayout(DEFAULT_RACK_LAYOUT);
		this.layout = fresh;
		this.compactor.setCommitted(fresh);
		try {
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch {}
	};

	isDragging = (id: string): boolean => {
		return this.activeDraggingId === id;
	};

	isResizing = (id: string): boolean => {
		return this.activeResizingId === id;
	};
}

export const layoutState = new LayoutState();
