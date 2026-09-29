<script lang="ts">
	import '$lib/styles/index.sass';
	import { motion, useReducedMotion } from '@humanspeak/svelte-motion';
	import { SPRING_PANEL, EASE_OUT } from '$lib/stores/ease.js';
	import Panelleft from '$lib/icons/panelleft.svelte';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import Settings from '$lib/components/ui/SettingsModal.svelte'
	import { registryItems } from '$lib/data/itemsRegistry';
	import IconMixer from '$lib/icons/surface/mixer.svelte';
	import IconDelay from '$lib/icons/surface/delay.svelte';
	import IconFilter from '$lib/icons/surface/filter.svelte'
	import IconDrumset from '$lib/icons/surface/drumset.svelte';
	import IconKick from '$lib/icons/surface/kick.svelte';
	import IconModulator from '$lib/icons/surface/modulator.svelte';
	import IconPlayer from '$lib/icons/surface/player.svelte';
	import IconSequencer from '$lib/icons/surface/sequencer.svelte';
	import IconStems from '$lib/icons/surface/stems.svelte';
	import IconWavetable from '$lib/icons/surface/wavetable.svelte';
	import IconReverb from '$lib/icons/surface/reverb.svelte'
	import Sequencer from '$lib/icons/surface/sequencer.svelte';

	const STORAGE_KEY = 'fractunes:drawer-open';

	let { children } = $props();
	let drawerOpen = $state(
		typeof window !== 'undefined'
			? localStorage.getItem(STORAGE_KEY) === 'true'
			: false
	);
	let settingsOpen = $state(false);
	let settingsHeight = $state(340);
	const reduce = useReducedMotion();

	$effect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, String(drawerOpen));
		} catch {}
	});

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
	}

	function toggleSettings() {
		settingsOpen = !settingsOpen;
	}
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<title>Fractunes</title>
</svelte:head>

<div class="app-viewport">
	<Sidebar bind:open={drawerOpen} onSettingsClick={toggleSettings}>
		<div class="box gap-sm pt-sm">
			<div class="box gap-sm rack-section bb pb-bs">
			<span class="text-sm">Generators</span>
			<div class="grid-3 gap-sm">
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconKick />
				<span class="text-sm">Kick</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconDrumset />
				<span class="text-sm">Drums</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconWavetable />
				<span class="text-sm">Waves</span>
			</div>
			</div>
			</div>

			<div class="box gap-sm rack-section bb pb-bs">
				<span class="text-sm">Tweak</span>
				<div class="grid-2 gap-sm">
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-xs">
				<IconFilter/>
				<span class="text-sm">Filter</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-xs">
				<IconDelay />
				<span class="text-sm">Delay</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-xs">
				<IconReverb/>
				<span class="text-sm">Reverb</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-xs">
				<IconModulator />
				<span class="text-sm">Modulator</span>
			</div>
				</div>
			</div>

			<div class="box gap-sm rack-section pb-bs">
				<span class="text-sm">Core</span>
			<div class="grid gap-sm">
				<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconMixer />
				<span class="text-md">Mixer</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconPlayer />
				<span class="text-md">Player</span>
			</div>
			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconStems />
				<span class="text-md">Stems</span>
			</div>

			<div class="drawer-draggable row gap-xs ycenter xcenter pad-sm">
				<IconSequencer />
				<span class="text-md">Sequencer</span>
			</div>
			</div>
			</div>
		</div>
	</Sidebar>

	<main class="app-shell">
		<motion.header
			class="app-header"
			data-tauri-drag-region
			initial={false}
			animate={{ paddingLeft: drawerOpen ? '16px' : '88px' }}
			transition={$reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_PANEL}
		>
			<div class="row gap-bs ycenter">
				<button data-variant="icon-mini" onclick={() => toggleDrawer()} aria-label="Toggle sidebar">
					<Panelleft />
				</button>
				<span class="app-name text-sm text-muted">fractunes</span>
			</div>
			<div class="row gap-bs ycenter">
				<a class="text-xs" href="/backgrounds">Backgrounds</a>
				<a class="text-xs" href="/trellis">Trellis</a>
				<a class="text-xs" href="/">Plate</a>
			</div>
		</motion.header>

		<div class="app-shell-body">
			<motion.div
				class="app-shell-track"
				initial={false}
				animate={{ y: settingsOpen ? -settingsHeight : 0 }}
				transition={$reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_PANEL}
			>
				<section class="main-area">
					{@render children()}
				</section>
				<Settings bind:open={settingsOpen} height={settingsHeight}>
					<div class="box gap-sm">
						<span class="mono text-xs text-secondary">AUDIO & ENGINE SETTINGS</span>
					</div>
				</Settings>
			</motion.div>
		</div>
	</main>

</div>
