export type ShortcutCategory = 'app' | 'rack' | 'transport' | 'performance';

export interface ShortcutItem {
	id: string;
	label: string;
	category: ShortcutCategory;
	key: string;
	code?: string;
	meta?: boolean;
	shift?: boolean;
	alt?: boolean;
	display: string;
	description?: string;
}

export const SHORTCUTS: Record<string, ShortcutItem> = {
	TOGGLE_DRAWER: {
		id: 'toggle_drawer',
		label: 'Toggle Sidebar',
		category: 'app',
		key: 'b',
		meta: true,
		display: '⌘B',
		description: 'Open or close the module drawer sidebar'
	},
	TOGGLE_SETTINGS: {
		id: 'toggle_settings',
		label: 'Toggle Settings',
		category: 'app',
		key: 'k',
		meta: true,
		display: '⌘K',
		description: 'Open or close the bottom settings panel'
	},
	RESET_LAYOUT: {
		id: 'reset_layout',
		label: 'Reset Rack Layout',
		category: 'rack',
		key: 'r',
		meta: true,
		display: '⌘R',
		description: 'Restore the 12×8 rack to default 4-shelf positions'
	},
	PLAY_PAUSE: {
		id: 'play_pause',
		label: 'Play / Pause',
		category: 'transport',
		key: ' ',
		code: 'Space',
		display: 'Space',
		description: 'Start or stop the audio engine sequencer'
	},
	TRIGGER_KICK: {
		id: 'trigger_kick',
		label: 'Trigger Kick',
		category: 'performance',
		key: '1',
		code: 'Digit1',
		display: '1',
		description: 'Manually audition kick drum'
	},
	TRIGGER_HAT_CL: {
		id: 'trigger_hat_cl',
		label: 'Trigger Closed Hat',
		category: 'performance',
		key: '2',
		code: 'Digit2',
		display: '2',
		description: 'Manually audition closed metallic hat'
	},
	TRIGGER_HAT_OP: {
		id: 'trigger_hat_op',
		label: 'Trigger Open Hat',
		category: 'performance',
		key: '3',
		code: 'Digit3',
		display: '3',
		description: 'Manually audition open metallic hat'
	},
	TRIGGER_BASS: {
		id: 'trigger_bass',
		label: 'Trigger Rolling Bass',
		category: 'performance',
		key: '4',
		code: 'Digit4',
		display: '4',
		description: 'Manually trigger 1/16 rolling bassline'
	}
};
