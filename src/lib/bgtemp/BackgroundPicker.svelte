<script lang="ts">
	import Background from './Background.svelte'
	import {
		BACKGROUNDS,
		AURA_CATEGORIES,
		PATTERN_CATEGORIES,
		getBackground,
		isAura
	} from './registry.js'
	import type { BackgroundPreset } from './types.js'

	type Kind = 'aura' | 'pattern'
	type Tone = 'light' | 'dark'

	const KIND_KEY = 'fractunes-bg-kind'
	const TONE_KEY = 'fractunes-bg-tone'

	function getStored<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
		if (typeof localStorage !== 'undefined') {
			try {
				const saved = localStorage.getItem(key)
				if (saved && (valid as readonly string[]).includes(saved)) {
					return saved as T
				}
			} catch {}
		}
		return fallback
	}

	interface Props {
		/** Selected preset id (aura or pattern). Bindable. */
		value?: string
		onchange?: (preset: BackgroundPreset) => void
		/** Show the large live sample + copy-snippet bar above the grid. Default true. */
		preview?: boolean
		/** Restrict which presets are offered. Defaults to every aura and pattern. */
		presets?: BackgroundPreset[]
		/** Component name used in the copied snippet. Default "Background". */
		snippetName?: string
		class?: string
	}

	let {
		value = $bindable(BACKGROUNDS[0].id),
		onchange,
		preview = true,
		presets = BACKGROUNDS,
		snippetName = 'Background',
		class: className = ''
	}: Props = $props()

	let kind = $state<Kind>(getStored(KIND_KEY, 'aura', ['aura', 'pattern']))
	let category = $state('all')
	let tone = $state<Tone>(getStored(TONE_KEY, 'dark', ['light', 'dark']))
	let query = $state('')
	let copied = $state(false)

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(KIND_KEY, kind)
			} catch {}
		}
	})

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(TONE_KEY, tone)
			} catch {}
		}
	})

	const kinds = $derived<Kind[]>([
		...(presets.some(isAura) ? (['aura'] as const) : []),
		...(presets.some((p) => !isAura(p)) ? (['pattern'] as const) : [])
	])

	const inKind = (p: BackgroundPreset) =>
		kind === 'aura' ? isAura(p) : !isAura(p)

	const categories = $derived([...new Set(presets.filter(inKind).map((p) => p.category))])

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase()
		return presets.filter(
			(p) =>
				inKind(p) &&
				(category === 'all' || p.category === category) &&
				(!isAura(p) || (tone === 'dark') === p.dark) &&
				(!q ||
					`${p.name} ${p.description ?? ''} ${isAura(p) ? p.mood : ''} ${p.id}`
						.toLowerCase()
						.includes(q))
		)
	})

	const current = $derived(presets.find((p) => p.id === value) ?? getBackground(value))

	function setKind(k: Kind) {
		kind = k
		category = 'all'
	}

	function setTone(t: Tone) {
		tone = t
	}

	function pick(p: BackgroundPreset) {
		value = p.id
		onchange?.(p)
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(`<${snippetName} preset="${value}">…</${snippetName}>`)
			copied = true
			setTimeout(() => (copied = false), 1400)
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="box gap-bs {className}">
	<div class="row wrap gap-bs ycenter">
		{#if kinds.length > 1}
			<div class="row gap-sm br-str pr-bs" role="group" aria-label="Type">
				{#each kinds as k (k)}
					<button type="button" class:active={kind === k} data-variant="small" data-shape="modern" aria-pressed={kind === k} onclick={() => setKind(k)}>
						{k === 'aura' ? 'Auras' : 'Patterns'}
					</button>
				{/each}
			</div>
		{/if}
		{#if kind !== 'pattern'}
			<div class="row gap-sm pr-bs br-str" role="group" aria-label="Aura tone">
				{#each (['light', 'dark'] as const) as t (t)}
					<button
						type="button" class="tt-c"
						class:active={tone === t} data-variant="small" data-shape="modern"
						aria-pressed={tone === t}
						onclick={() => setTone(t)}
					>
						{t}
					</button>
				{/each}
			</div>
		{/if}
		<div class="buttons-row" role="group" aria-label="Category">
			{#each ['all', ...categories] as c (c)}
				<button type="button" class="tt-c" class:active={category === c} data-variant="small" data-shape="modern" aria-pressed={category === c} onclick={() => (category = c)}>
					{c}
				</button>
			{/each}
		</div>
	</div>
	<div class="bp-grid" role="radiogroup" aria-label="Backgrounds">
		{#each visible as p (p.id)}
			<button
				type="button"
				role="radio"
				data-shape="modern"
				aria-checked={p.id === value}
				class="bp-item"
				title={p.description ?? p.name}
				onclick={() => pick(p)}
			>
				<Background
					preset={p}
					blurScale={0.25}
					applyText
					class="bp-thumb radius-md"
					style={isAura(p) ? '' : 'background-color: Canvas'}
				/>
				<span>{p.name}</span>
			</button>
		{:else}
			<p class="bp-empty">Nothing matches.</p>
		{/each}
	</div>
</div>

<style>
	.bp-grid {
		display: grid;
		grid-template-columns: repeat(8, minmax(8.5rem, 1fr));
		gap: var(--space-lg);
	}
	.bp-item {
		display: grid;
		gap: 0.375rem;
		text-align: left;
		font: inherit;
		font-size: 0.75rem;
		color: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		content-visibility: auto;
		contain-intrinsic-size: auto 8rem;
	}
	:global(.bp-thumb) {
		aspect-ratio: 1/1;
	}
	.bp-item:hover :global(.bp-thumb) {
		outline-color: color-mix(in srgb, currentColor 35%, transparent);
	}
	.bp-item[aria-checked='true'] :global(.bp-thumb) {
		outline-color: currentColor;
	}
	.bp-item:focus-visible :global(.bp-thumb) {
		outline-color: currentColor;
	}
	.bp-empty {
		grid-column: 1 / -1;
		opacity: 0.6;
	}
</style>
