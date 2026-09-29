export { default as Background } from './Background.svelte'
export { default as BackgroundPicker } from './BackgroundPicker.svelte'
export {
	BACKGROUNDS,
	AURA_PRESETS,
	PATTERN_PRESETS,
	AURA_CATEGORIES,
	PATTERN_CATEGORIES,
	getBackground,
	getAura,
	getPattern,
	isAura,
	isPattern
} from './registry.js'
export type { BackgroundPreset, AuraPreset, AuraLayer, PatternPreset } from './types.js'
