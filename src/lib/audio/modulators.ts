import type { AudioEngine } from "./engine";

export interface ModulatorState {
  wave: string;
  rate: number;
  amount: number;
  phase: number;
}

export class ModulatorEngine {
  engine: AudioEngine;
  modA: ModulatorState = {
    wave: "sine",
    rate: 0.5,
    amount: 40,
    phase: 0
  };
  modB: ModulatorState = {
    wave: "fold",
    rate: 0.25,
    amount: 60,
    phase: 0
  };
  lastTime: number = performance.now();
  running = true;
  rafId: number | null = null;

  constructor(engine: AudioEngine) {
    this.engine = engine;
    this.tick = this.tick.bind(this);
    if (typeof window !== "undefined") {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  destroy() {
    this.running = false;
    if (this.rafId && typeof window !== "undefined") {
      cancelAnimationFrame(this.rafId);
    }
  }

  tick() {
    if (!this.running) return;
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.modA.phase = (this.modA.phase + dt * this.modA.rate) % 1.0;
    this.modB.phase = (this.modB.phase + dt * this.modB.rate) % 1.0;

    if (this.engine && this.engine.synth) {
      const depthHz = (this.modA.amount / 100) * 800;
      const modAVal = this.shape(this.modA.wave, this.modA.phase);
      this.engine.synth.modAOffset = modAVal * depthHz;

      const modBVal = this.shape(this.modB.wave, this.modB.phase);
      this.engine.synth.modBOffset = modBVal * (this.modB.amount / 100) * 0.2;
    }

    if (typeof window !== "undefined") {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  shape(wave: string, phase: number): number {
    const p = ((phase % 1) + 1) % 1;
    switch ((wave || "sine").toLowerCase()) {
      case "triangle":
        return 4 * Math.abs(p - 0.5) - 1;
      case "saw":
        return p * 2 - 1;
      case "square":
        return p < 0.5 ? 1 : -1;
      case "fold": {
        const t = (p * 4) % 2;
        return (t < 1 ? t : 2 - t) * 2 - 1;
      }
      default:
        return Math.sin(p * Math.PI * 2);
    }
  }

  setModA(rate?: number | null, amount?: number | null, wave?: string | null) {
    if (rate != null) this.modA.rate = Math.max(0.05, Math.min(20, rate));
    if (amount != null) this.modA.amount = Math.max(0, Math.min(100, amount));
    if (wave) this.modA.wave = wave;
  }

  setModB(rate?: number | null, amount?: number | null, wave?: string | null) {
    if (rate != null) this.modB.rate = Math.max(0.05, Math.min(20, rate));
    if (amount != null) this.modB.amount = Math.max(0, Math.min(100, amount));
    if (wave) this.modB.wave = wave;
  }
}
