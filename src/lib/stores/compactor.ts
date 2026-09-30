import type { CompactType, Compactor, Layout, LayoutItem } from '@snapgridjs/svelte';

export function collides(a: LayoutItem, b: LayoutItem): boolean {
	if (a.i === b.i) return false;
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function hasAnyOverlap(layout: Layout): { a: string; b: string } | null {
	for (let i = 0; i < layout.length; i++) {
		for (let j = i + 1; j < layout.length; j++) {
			if (collides(layout[i], layout[j])) {
				return { a: layout[i].i, b: layout[j].i };
			}
		}
	}
	return null;
}

export function cloneLayout(layout: Layout): LayoutItem[] {
	return layout.map((it: LayoutItem) => ({ ...it }));
}

export interface AdaptiveCompactorOptions {
	cols?: number;
	maxRows?: number;
}

export class AdaptiveCompactor implements Compactor {
	readonly type: CompactType = null;
	readonly allowOverlap = false;
	readonly preventCollision = false;

	cols: number;
	maxRows: number;

	activeId: string | null = null;
	activeKind: 'resize' | 'drag' | null = null;
	initialLayout: LayoutItem[] = [];
	initialItem: LayoutItem | null = null;
	lastCommitted: LayoutItem[] = [];

	constructor(options: AdaptiveCompactorOptions = {}) {
		this.cols = options.cols ?? 12;
		this.maxRows = options.maxRows ?? 8;
	}

	onResizeStart = (layout: Layout, oldItem: LayoutItem | null) => {
		if (!oldItem) return;
		this.activeId = oldItem.i;
		this.activeKind = 'resize';
		this.initialLayout = cloneLayout(layout);
		this.initialItem = { ...oldItem };
	};

	onResizeStop = () => {
		this.activeId = null;
		this.activeKind = null;
		this.initialLayout = [];
		this.initialItem = null;
	};

	onDragStart = (layout: Layout, oldItem: LayoutItem | null) => {
		if (!oldItem) return;
		this.activeId = oldItem.i;
		this.activeKind = 'drag';
		this.initialLayout = cloneLayout(layout);
		this.initialItem = { ...oldItem };
	};

	onDragStop = () => {
		this.activeId = null;
		this.activeKind = null;
		this.initialLayout = [];
		this.initialItem = null;
	};

	setCommitted(layout: Layout) {
		this.lastCommitted = cloneLayout(layout);
	}

	compact = (layout: Layout, cols: number = this.cols): Layout => {
		let work = cloneLayout(layout);

		// Auto-detect interaction if callbacks were not triggered yet
		let activeId = this.activeId;
		let kind = this.activeKind;
		let initLayout = this.initialLayout;
		let initTarget = this.initialItem;

		if (!activeId && this.lastCommitted.length > 0) {
			for (const it of work) {
				const prev = this.lastCommitted.find((p) => p.i === it.i);
				if (prev) {
					if (it.w !== prev.w || it.h !== prev.h) {
						activeId = it.i;
						kind = 'resize';
						initLayout = this.lastCommitted;
						initTarget = prev;
						break;
					} else if (it.x !== prev.x || it.y !== prev.y) {
						activeId = it.i;
						kind = 'drag';
						initLayout = this.lastCommitted;
						initTarget = prev;
						break;
					}
				}
			}
		}

		if (activeId && initTarget && initLayout.length > 0) {
			if (kind === 'resize') {
				work = this.handleAutoShrinkResize(work, activeId, initLayout, initTarget, cols);
			} else if (kind === 'drag') {
				work = this.handleNonOverlappingDrag(work, activeId, initLayout, initTarget, cols);
			}
		}

		// Always enforce grid boundaries and zero-overlap invariants
		return this.enforceInvariants(work, activeId, cols);
	};

	/**
	 * Auto-resizing: When target grows larger, colliding tiles shrink/compress to make room.
	 */
	private handleAutoShrinkResize(
		layout: LayoutItem[],
		activeId: string,
		initLayout: LayoutItem[],
		initTarget: LayoutItem,
		cols: number
	): LayoutItem[] {
		const work = cloneLayout(layout);
		const target = work.find((it) => it.i === activeId);
		if (!target) return layout;

		// Hard bounds on target
		target.x = Math.max(0, Math.min(target.x, cols - 1));
		target.y = Math.max(0, Math.min(target.y, this.maxRows - 1));
		target.w = Math.max(1, Math.min(target.w, cols - target.x));
		target.h = Math.max(1, Math.min(target.h, this.maxRows - target.y));

		const expandedRight = target.x + target.w > initTarget.x + initTarget.w;
		const expandedDown = target.y + target.h > initTarget.y + initTarget.h;

		// 1. Horizontal expansion (Right): shrink / push items to the right
		if (expandedRight) {
			let changed = true;
			let passes = 0;
			while (changed && passes < 40) {
				changed = false;
				passes++;

				for (let i = 0; i < work.length; i++) {
					const a = work[i];
					for (let j = 0; j < work.length; j++) {
						if (i === j) continue;
						const b = work[j];
						if (collides(a, b)) {
							const [leftItem, rightItem] = a.i === target.i || a.x <= b.x ? [a, b] : [b, a];
							const reqX = leftItem.x + leftItem.w;
							if (rightItem.x < reqX) {
								const origRight = rightItem.x + rightItem.w;
								const availW = origRight - reqX;
								const minW = rightItem.minW ?? 1;
								rightItem.x = reqX;
								rightItem.w = Math.max(minW, availW);
								changed = true;
							}
						}
					}
				}
			}

			// Check right boundary overflow
			let maxOverflowX = 0;
			for (const it of work) {
				if (it.x + it.w > cols) {
					maxOverflowX = Math.max(maxOverflowX, it.x + it.w - cols);
				}
			}
			if (maxOverflowX > 0) {
				const clampedW = Math.max(initTarget.w, target.w - maxOverflowX);
				const fresh = cloneLayout(initLayout);
				const freshTarget = fresh.find((it) => it.i === activeId);
				if (freshTarget) {
					freshTarget.w = clampedW;
					freshTarget.h = target.h;
					return this.handleAutoShrinkResize(fresh, activeId, initLayout, initTarget, cols);
				}
			}
		}

		// 2. Vertical expansion (Down): shrink / push items below
		if (expandedDown) {
			let changed = true;
			let passes = 0;
			while (changed && passes < 40) {
				changed = false;
				passes++;

				for (let i = 0; i < work.length; i++) {
					const a = work[i];
					for (let j = 0; j < work.length; j++) {
						if (i === j) continue;
						const b = work[j];
						if (collides(a, b)) {
							const [topItem, bottomItem] = a.i === target.i || a.y <= b.y ? [a, b] : [b, a];
							const reqY = topItem.y + topItem.h;
							if (bottomItem.y < reqY) {
								const origBottom = bottomItem.y + bottomItem.h;
								const availH = origBottom - reqY;
								const minH = bottomItem.minH ?? 1;
								bottomItem.y = reqY;
								bottomItem.h = Math.max(minH, availH);
								changed = true;
							}
						}
					}
				}
			}

			// Check bottom boundary overflow
			let maxOverflowY = 0;
			for (const it of work) {
				if (it.y + it.h > this.maxRows) {
					maxOverflowY = Math.max(maxOverflowY, it.y + it.h - this.maxRows);
				}
			}
			if (maxOverflowY > 0) {
				const clampedH = Math.max(initTarget.h, target.h - maxOverflowY);
				const fresh = cloneLayout(initLayout);
				const freshTarget = fresh.find((it) => it.i === activeId);
				if (freshTarget) {
					freshTarget.w = target.w;
					freshTarget.h = clampedH;
					return this.handleAutoShrinkResize(fresh, activeId, initLayout, initTarget, cols);
				}
			}
		}

		return work;
	}

	/**
	 * Non-overlapping drag: Displaces colliding items into vacated space or free cells.
	 * If impossible without collision, reverts to last safe placement.
	 */
	private handleNonOverlappingDrag(
		layout: LayoutItem[],
		activeId: string,
		initLayout: LayoutItem[],
		initTarget: LayoutItem,
		cols: number
	): LayoutItem[] {
		const work = cloneLayout(layout);
		const target = work.find((it) => it.i === activeId);
		if (!target) return layout;

		target.x = Math.max(0, Math.min(target.x, cols - target.w));
		target.y = Math.max(0, Math.min(target.y, this.maxRows - target.h));

		const colliding = work.filter((it) => it.i !== target.i && collides(target, it));
		if (colliding.length === 0) return work;

		// Build occupancy map for static items
		const occupied: (string | null)[][] = Array(this.maxRows)
			.fill(null)
			.map(() => Array(cols).fill(null));

		for (const it of work) {
			if (it.i !== target.i && !colliding.some((c) => c.i === it.i)) {
				for (let r = it.y; r < it.y + it.h; r++) {
					for (let c = it.x; c < it.x + it.w; c++) {
						if (r < this.maxRows && c < cols) occupied[r][c] = it.i;
					}
				}
			}
		}

		// Place target
		for (let r = target.y; r < target.y + target.h; r++) {
			for (let c = target.x; c < target.x + target.w; c++) {
				if (r < this.maxRows && c < cols) occupied[r][c] = target.i;
			}
		}

		const canFit = (item: LayoutItem, x: number, y: number): boolean => {
			if (x + item.w > cols || y + item.h > this.maxRows) return false;
			for (let r = y; r < y + item.h; r++) {
				for (let c = x; c < x + item.w; c++) {
					if (occupied[r][c] !== null) return false;
				}
			}
			return true;
		};

		const place = (item: LayoutItem, x: number, y: number) => {
			item.x = x;
			item.y = y;
			for (let r = y; r < y + item.h; r++) {
				for (let c = x; c < x + item.w; c++) {
					occupied[r][c] = item.i;
				}
			}
		};

		for (const item of colliding) {
			let placed = false;
			// 1. Try placing in vacated spot (swap)
			if (canFit(item, initTarget.x, initTarget.y)) {
				place(item, initTarget.x, initTarget.y);
				placed = true;
			} else {
				// 2. Nearest search on the 12x8 matrix
				let bestDist = Infinity;
				let bestPos: { x: number; y: number } | null = null;
				for (let r = 0; r <= this.maxRows - item.h; r++) {
					for (let c = 0; c <= cols - item.w; c++) {
						if (canFit(item, c, r)) {
							const dist = Math.hypot(c - item.x, r - item.y);
							if (dist < bestDist) {
								bestDist = dist;
								bestPos = { x: c, y: r };
							}
						}
					}
				}
				if (bestPos) {
					place(item, bestPos.x, bestPos.y);
					placed = true;
				}
			}

			if (!placed) {
				// Revert to initial layout if cannot fit
				return cloneLayout(initLayout);
			}
		}

		return work;
	}

	/**
	 * Final invariant enforcement: all tiles within 12x8, no overlapping cells.
	 */
	private enforceInvariants(
		layout: LayoutItem[],
		activeId: string | null,
		cols: number
	): LayoutItem[] {
		const work = cloneLayout(layout);

		// 1. Clamp to boundary
		for (const it of work) {
			it.w = Math.max(1, Math.min(it.w, cols));
			it.h = Math.max(1, Math.min(it.h, this.maxRows));
			it.x = Math.max(0, Math.min(it.x, cols - it.w));
			it.y = Math.max(0, Math.min(it.y, this.maxRows - it.h));
		}

		// 2. Resolve any residual overlap
		let iterations = 0;
		while (iterations < 20) {
			const overlap = hasAnyOverlap(work);
			if (!overlap) break;
			iterations++;

			const itemB = work.find((it) => it.i === (overlap.b !== activeId ? overlap.b : overlap.a));
			if (!itemB) break;

			// Find free cells for itemB
			const occupied: boolean[][] = Array(this.maxRows)
				.fill(false)
				.map(() => Array(cols).fill(false));

			for (const it of work) {
				if (it.i !== itemB.i) {
					for (let r = it.y; r < it.y + it.h; r++) {
						for (let c = it.x; c < it.x + it.w; c++) {
							if (r < this.maxRows && c < cols) occupied[r][c] = true;
						}
					}
				}
			}

			let found = false;
			for (let r = 0; r <= this.maxRows - itemB.h && !found; r++) {
				for (let c = 0; c <= cols - itemB.w && !found; c++) {
					let empty = true;
					for (let checkR = r; checkR < r + itemB.h; checkR++) {
						for (let checkC = c; checkC < c + itemB.w; checkC++) {
							if (occupied[checkR][checkC]) {
								empty = false;
								break;
							}
						}
						if (!empty) break;
					}
					if (empty) {
						itemB.x = c;
						itemB.y = r;
						found = true;
					}
				}
			}

			if (!found) {
				// Shrink itemB to 1x1 if needed
				itemB.w = 1;
				itemB.h = 1;
			}
		}

		return work;
	}
}
