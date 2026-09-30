/**
 * Global Keyboard Shortcut Manager for Fractunes.
 * Handles key combination matching, modifier normalization (⌘ on macOS / Ctrl on Windows),
 * input field suppression, and event dispatching.
 */

import { SHORTCUTS, type ShortcutItem } from '$lib/data/shortcuts';

export class ShortcutManager {
	private handlers = new Map<string, () => void>();

	/**
	 * Register an action callback for a shortcut ID.
	 * Returns an unregister cleanup function.
	 */
	register(id: string, action: () => void): () => void {
		this.handlers.set(id, action);
		return () => {
			if (this.handlers.get(id) === action) {
				this.handlers.delete(id);
			}
		};
	}

	unregister(id: string): void {
		this.handlers.delete(id);
	}

	execute(id: string): boolean {
		const action = this.handlers.get(id);
		if (action) {
			action();
			return true;
		}
		return false;
	}

	/**
	 * Main keydown listener to bind to <svelte:window onkeydown={shortcutManager.handleKeyDown} />
	 */
	handleKeyDown = (e: KeyboardEvent): boolean => {
		// Ignore if user is typing in an input, textarea, or select element
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement ||
			e.target instanceof HTMLSelectElement
		) {
			return false;
		}

		const isMeta = e.metaKey || e.ctrlKey;
		const isShift = e.shiftKey;
		const isAlt = e.altKey;

		for (const shortcut of Object.values(SHORTCUTS)) {
			// Validate modifiers
			const requiresMeta = !!shortcut.meta;
			if (requiresMeta !== isMeta) continue;

			const requiresShift = !!shortcut.shift;
			if (requiresShift !== isShift) continue;

			const requiresAlt = !!shortcut.alt;
			if (requiresAlt !== isAlt) continue;

			// Validate key
			const keyMatch =
				e.key.toLowerCase() === shortcut.key.toLowerCase() ||
				(shortcut.code !== undefined && e.code === shortcut.code);

			if (keyMatch) {
				const handler = this.handlers.get(shortcut.id);
				if (handler) {
					e.preventDefault();
					e.stopPropagation();
					handler();
					return true;
				}
			}
		}

		return false;
	};
}

export const shortcutManager = new ShortcutManager();
