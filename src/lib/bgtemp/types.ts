export interface AuraLayer {
	/** Any CSS background value (gradients). */
	bg: string
	/** CSS mix-blend-mode. */
	blend: string
	/** Blur in px (mobile / below 768px, and desktop unless `blurDesktop` is set). */
	blur: number
	blurDesktop?: number
	/** Defaults to 1. */
	opacity?: number
}

export interface AuraPreset {
	id: string
	name: string
	category: string
	mood: string
	/** True when the preset is meant for light text on a dark base. */
	dark: boolean
	/** Colour the layers blend against. */
	base: string
	/** Suggested foreground colour. */
	text: string
	description: string
	layers: AuraLayer[]
}

/** A single-layer CSS background pattern (grids, dots, masks, glows…). */
export interface PatternPreset {
	id: string
	name: string
	category: string
	description?: string
	/** Declarations applied to one absolutely positioned layer, e.g. "background-image:…;background-size:24px 24px". */
	css: string
	/** Extra px to overscan the layer by (set for blurred patterns so edges stay soft). */
	bleed?: number
	/** @keyframes rules needed by an `animation` in `css`. */
	keyframes?: string
}

export type BackgroundPreset = AuraPreset | PatternPreset
