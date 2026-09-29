export const presetAxes = {
	layout: ['tight', 'default', 'comfy'],
	shape: ['round', 'default', 'sharp'],
	mode: ['dark', 'light']
} as const;

export const presetDefaults = {
	layout: 'default',
	shape: 'default',
	mode: 'dark'
} as const;

export type Mode = 'light' | 'dark';
export type PresetAxis = keyof typeof presetAxes;

export const STORAGE_KEY = 'fractunesApp.presets';
export const MODE_KEY = 'fractunesApp.mode';

export const presetState: Record<PresetAxis, string> = { ...presetDefaults };
type Listener = (axis: PresetAxis, value: string) => void;
const listeners = new Set<Listener>();

export function onPresetChange(fn: Listener): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function isDefault(axis: PresetAxis, value: string): boolean {
	return value === presetDefaults[axis];
}

function isValid(axis: PresetAxis, value: string): boolean {
	return (presetAxes[axis] as readonly string[]).includes(value);
}

function applyAttr(axis: PresetAxis, value: string): void {
	const root = document.documentElement;
	if (isDefault(axis, value)) root.removeAttribute(`data-${axis}`);
	else root.setAttribute(`data-${axis}`, value);
}

function persist(): void {
	const nonDefaults: Record<string, string> = {};
	for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
		if (!isDefault(axis, presetState[axis])) nonDefaults[axis] = presetState[axis];
	}
	try {
		if (Object.keys(nonDefaults).length)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nonDefaults));
		else localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* storage unavailable — presets stay session-local */
	}
}

export function initPresets(): void {
	if (typeof document === 'undefined') return;
	try {
		const savedMode = localStorage.getItem(MODE_KEY);
		if (savedMode === 'dark' || savedMode === 'light') setMode(savedMode);
	} catch {
		/* storage unavailable — defaults stand */
	}
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
			// A page/layout scope outranks the stored value while it is active.
			if (scoped.has(axis)) continue;
			const v = saved[axis];
			if (v && isValid(axis, v)) {
				presetState[axis] = v;
				applyAttr(axis, v);
				for (const fn of listeners) fn(axis, v);
			}
		}
	} catch {
		/* corrupt blob — defaults stand */
	}
}

export function setPreset(axis: PresetAxis, value: string): void {
	if (typeof document === 'undefined') return;
	if (!isValid(axis, value)) return;
	presetState[axis] = value;
	applyAttr(axis, value);
	persist();
	for (const fn of listeners) fn(axis, value);
}

export function getPreset(axis: PresetAxis): string {
	return presetState[axis];
}

const scoped = new Set<PresetAxis>();

export function scopePreset(axis: PresetAxis, value: string): () => void {
	if (typeof document === 'undefined') return () => {};
	if (!isValid(axis, value)) return () => {};

	const previous = presetState[axis];
	scoped.add(axis);
	presetState[axis] = value;
	applyAttr(axis, value);
	for (const fn of listeners) fn(axis, value);

	return () => {
		scoped.delete(axis);
		presetState[axis] = previous;
		applyAttr(axis, previous);
		for (const fn of listeners) fn(axis, previous);
	};
}

export function cyclePreset(axis: PresetAxis): string {
	const values = presetAxes[axis] as readonly string[];
	const next = values[(values.indexOf(presetState[axis]) + 1) % values.length];
	setPreset(axis, next);
	return next;
}

export function getPresetScript(): string {
	const axes = JSON.stringify(presetAxes).replaceAll('"', "'");
	const defs = JSON.stringify(presetDefaults).replaceAll('"', "'");
	return `(function(){try{var v=${axes};var d=${defs};var r=document.documentElement;var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');for(var k in v){var val=s[k];if(val&&val!==d[k])r.setAttribute('data-'+k,val);}var m=localStorage.getItem('${MODE_KEY}');if(m==='dark'||m==='light')r.setAttribute('data-mode',m);}catch(e){}})();`;
}

export function setMode(mode: Mode | null): void {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (mode === null) {
		root.removeAttribute('data-mode');
		try {
			localStorage.removeItem(MODE_KEY);
		} catch {
			/* storage unavailable */
		}
	} else {
		root.setAttribute('data-mode', mode);
		try {
			localStorage.setItem(MODE_KEY, mode);
		} catch {
			/* storage unavailable — the choice stays session-local */
		}
	}
	for (const fn of modeListeners) fn(getMode());
}

export function getMode(): Mode {
	if (typeof document === 'undefined') return 'dark';
	const attr = document.documentElement.getAttribute('data-mode');
	if (attr === 'dark' || attr === 'light') return attr;
	return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

export function isDark(): boolean {
	return getMode() === 'dark';
}

export function toggleMode(): Mode {
	const next: Mode = getMode() === 'dark' ? 'light' : 'dark';
	setMode(next);
	return next;
}

type ModeListener = (mode: Mode) => void;
const modeListeners = new Set<ModeListener>();

/** Subscribe to mode changes — however they were made. Returns an unsubscribe. */
export function onModeChange(fn: ModeListener): () => void {
	modeListeners.add(fn);
	return () => modeListeners.delete(fn);
}

export const presets = $state<
	Record<PresetAxis, string>
>({ ...presetDefaults });

onPresetChange((axis, value) => {
	presets[axis] = value;
});
onModeChange((mode) => {
	presets.mode = mode;
});

export function sync(): void {
	for (const axis of Object.keys(presetAxes) as PresetAxis[]) presets[axis] = presetState[axis];
	presets.mode = getMode();
}

