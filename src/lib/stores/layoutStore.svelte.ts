/**
 * Svelte 5 Reactive Layout Store for managing and persisting component spans across the app.
 */

import { writable } from "svelte/store";

export const currentSpan = writable("is-2-wide");

const STORAGE_PREFIX = "fractunes:box-span:";

export class LayoutStore {
  spans = $state<Record<string, number>>({});

  constructor() {
    if (typeof window !== "undefined") {
      this.hydrateAll();
    }
  }

  private hydrateAll() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const id = key.substring(STORAGE_PREFIX.length);
          const raw = localStorage.getItem(key);
          const val = raw ? parseInt(raw, 10) : NaN;
          if (!isNaN(val) && val >= 1 && val <= 12) {
            this.spans[id] = val;
          }
        }
      }
    } catch (e) {
      // localStorage disabled or security error
    }
  }

  get(id: string, fallback = 2): number {
    return this.spans[id] ?? fallback;
  }

  getClass(id: string, fallback = 2): string {
    const val = this.get(id, fallback);
    return `is-${val}-wide`;
  }

  set(id: string, span: number | string, min = 2, max = 12): number {
    let numeric = typeof span === "number" ? span : parseInt(span.replace(/\D/g, ""), 10);
    if (isNaN(numeric)) numeric = min;
    const clamped = Math.max(min, Math.min(max, Math.round(numeric)));

    this.spans[id] = clamped;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${id}`, clamped.toString());
      } catch (e) {
        // ignore
      }
    }
    return clamped;
  }

  expand(id: string, step = 1, max = 12, min = 2): number {
    const curr = this.get(id, min);
    return this.set(id, Math.min(max, curr + step), min, max);
  }

  contract(id: string, step = 1, min = 2, max = 12): number {
    const curr = this.get(id, min);
    return this.set(id, Math.max(min, curr - step), min, max);
  }

  reset(id: string, fallback = 2) {
    this.set(id, fallback);
  }

  resetAll() {
    this.spans = {};
    if (typeof window !== "undefined") {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        // ignore
      }
    }
  }
}

export const layoutStore = new LayoutStore();