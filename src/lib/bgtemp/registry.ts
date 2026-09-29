import { AURA_PRESETS } from './presets.js'
import { PATTERN_PRESETS } from './patterns.js'
import type { AuraPreset, BackgroundPreset, PatternPreset } from './types.js'

export { AURA_PRESETS, PATTERN_PRESETS }

/** Every aura followed by every pattern. */
export const BACKGROUNDS: BackgroundPreset[] = [...AURA_PRESETS, ...PATTERN_PRESETS]

const byId = new Map<string, BackgroundPreset>(BACKGROUNDS.map((p) => [p.id, p]))

export const AURA_CATEGORIES: string[] = [...new Set(AURA_PRESETS.map((p) => p.category))]
export const PATTERN_CATEGORIES: string[] = [...new Set(PATTERN_PRESETS.map((p) => p.category))]

export function isAura(p: BackgroundPreset): p is AuraPreset {
	return 'layers' in p
}

export function isPattern(p: BackgroundPreset): p is PatternPreset {
	return 'css' in p
}

/** Look up any preset (aura or pattern) by id. */
export function getBackground(id: string): BackgroundPreset | undefined {
	return byId.get(id)
}

/** Look up an aura by id. Returns undefined for unknown ids or patterns. */
export function getAura(id: string): AuraPreset | undefined {
	const p = byId.get(id)
	return p && isAura(p) ? p : undefined
}

/** Look up a pattern by id. Returns undefined for unknown ids or auras. */
export function getPattern(id: string): PatternPreset | undefined {
	const p = byId.get(id)
	return p && isPattern(p) ? p : undefined
}
