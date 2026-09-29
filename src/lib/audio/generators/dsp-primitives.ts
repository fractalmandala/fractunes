/**
 * Digital Signal Processing (DSP) mathematical primitives for Psytrance synthesis.
 * Implements sample-accurate filters, oscillators, waveshapers, and envelope generators.
 */

/**
 * 4-Pole Moog Ladder Low-Pass Filter simulation.
 * Features non-linear feedback saturation to produce warm analog resonance without digital oscillation blowup.
 */
export class MoogLadder4Pole {
  private s = [0, 0, 0, 0];
  private sampleRate: number;

  constructor(sampleRate = 44100) {
    this.sampleRate = sampleRate;
    this.reset();
  }

  reset(): void {
    this.s = [0, 0, 0, 0];
  }

  /**
   * Process a single audio sample through the 24dB/oct ladder filter.
   * @param input Input sample [-1..1]
   * @param cutoff Frequency in Hz (e.g. 100 to 18000)
   * @param resonance Q factor (typically 0.7 to 1.5; gentle, warm, non-whistling)
   */
  process(input: number, cutoff: number, resonance: number): number {
    const fc = Math.max(20, Math.min(cutoff, this.sampleRate * 0.45));
    const w = (2.0 * Math.PI * fc) / this.sampleRate;
    const g = 0.98 * (1.0 - Math.exp(-w));

    // Non-linear feedback loop (tanh provides gentle analog compression)
    const feedback = resonance * this.s[3];
    const u = Math.tanh(input - feedback);

    // 4 cascaded one-pole integrator stages
    this.s[0] += g * (u - this.s[0]);
    this.s[1] += g * (this.s[0] - this.s[1]);
    this.s[2] += g * (this.s[1] - this.s[2]);
    this.s[3] += g * (this.s[2] - this.s[3]);

    return this.s[3];
  }
}

/**
 * Resonant 2-pole High-Pass Filter (Biquad)
 */
export class HighPassFilter {
  private x1 = 0;
  private x2 = 0;
  private y1 = 0;
  private y2 = 0;
  private sampleRate: number;

  constructor(sampleRate = 44100) {
    this.sampleRate = sampleRate;
  }

  reset(): void {
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
  }

  process(input: number, cutoff: number, q: number): number {
    const fc = Math.max(20, Math.min(cutoff, this.sampleRate * 0.45));
    const w0 = (2.0 * Math.PI * fc) / this.sampleRate;
    const cosw0 = Math.cos(w0);
    const sinw0 = Math.sin(w0);
    const alpha = sinw0 / (2.0 * Math.max(0.1, q));

    const b0 = (1 + cosw0) / 2;
    const b1 = -(1 + cosw0);
    const b2 = (1 + cosw0) / 2;
    const a0 = 1 + alpha;
    const a1 = -2 * cosw0;
    const a2 = 1 - alpha;

    const out = (b0 / a0) * input + (b1 / a0) * this.x1 + (b2 / a0) * this.x2 - (a1 / a0) * this.y1 - (a2 / a0) * this.y2;

    this.x2 = this.x1;
    this.x1 = input;
    this.y2 = this.y1;
    this.y1 = out;

    return out;
  }
}

/**
 * Synthesizes a band-limited Sawtooth wave at sample t via Fourier summation.
 * Keeps all harmonics below Nyquist to ensure 100% alias-free punch.
 */
export function bandlimitedSaw(freq: number, t: number, sampleRate = 44100, maxHarmonics = 35): number {
  const nyquist = sampleRate * 0.45;
  let val = 0;
  const numH = Math.min(maxHarmonics, Math.floor(nyquist / freq));
  for (let h = 1; h <= numH; h++) {
    val += (1.0 / h) * Math.sin(2.0 * Math.PI * freq * h * t);
  }
  return val;
}

/**
 * Soft saturation via hyperbolic tangent (tanh).
 */
export function softSaturate(x: number, drive = 1.0): number {
  return Math.tanh(x * drive);
}

/**
 * Asymmetric saturation: introduces even harmonics (2nd order) along with odd harmonics.
 * This is the secret to the thick, muscular lower-mid "chunk" of Israeli psytrance bass.
 */
export function asymmetricChunkDrive(x: number, drive = 1.0, asymmetry = 0.16): number {
  const driven = x * drive;
  return Math.tanh(driven + asymmetry * driven * driven);
}

/**
 * Normalizes a buffer to a target peak level (e.g. 0.95 = -0.45 dB).
 */
export function normalizeBuffer(buffer: Float32Array, targetPeak = 0.95): number {
  let maxAmp = 0;
  for (let i = 0; i < buffer.length; i++) {
    const a = Math.abs(buffer[i]);
    if (a > maxAmp) maxAmp = a;
  }

  if (maxAmp > 0.0001) {
    const factor = targetPeak / maxAmp;
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] *= factor;
    }
  }

  return maxAmp > 0 ? 20 * Math.log10(maxAmp) : -100;
}

/**
 * Applies a smooth fade-in and fade-out to prevent micro-clicks.
 */
export function applyDeclickFades(buffer: Float32Array, fadeInSamples = 32, fadeOutSamples = 128): void {
  const n = buffer.length;
  const inLen = Math.min(fadeInSamples, Math.floor(n / 2));
  for (let i = 0; i < inLen; i++) {
    buffer[i] *= i / inLen;
  }
  const outLen = Math.min(fadeOutSamples, Math.floor(n / 2));
  for (let i = 0; i < outLen; i++) {
    const idx = n - 1 - i;
    buffer[idx] *= i / outLen;
  }
}
