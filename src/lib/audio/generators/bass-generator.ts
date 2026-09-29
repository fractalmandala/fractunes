/**
 * Pure mathematical DSP synthesizer for Israeli Morning & Full-On Chunky Bass.
 * Features 4-Pole Moog ladder filtering, Saw + Sub oscillator layering, and asymmetric chunk drive.
 */

import {
  type BassGeneratorParams,
  type GeneratedAudio
} from "./types";
import {
  MoogLadder4Pole,
  bandlimitedSaw,
  asymmetricChunkDrive,
  normalizeBuffer,
  applyDeclickFades
} from "./dsp-primitives";
import { encodeWav16, createWavBlob } from "./wav-encoder";

export const DEFAULT_BASS_PARAMS: BassGeneratorParams = {
  rootPitch: 48.999,  // G1
  duration: 0.40,     // 400 ms for full note, or 0.105 for 16th hit
  gateRatio: 0.88,    // 88% gate time
  sawWeight: 0.75,    // 75% Sawtooth
  subWeight: 0.45,    // 45% Sub-Sine
  filterBase: 120,    // Base floor cutoff (Hz)
  filterPeak: 1850,   // Pluck envelope peak (Hz)
  filterDecay: 0.026, // Pluck envelope decay time (sec)
  resonance: 1.08,    // Moog Q (warm, rubbery, zero whistling)
  drive: 2.2,         // Lower-mid asymmetric chunk drive
  accent: 1.0,        // Velocity scale
  sampleRate: 44100
};

export function generateBass(
  customParams: Partial<BassGeneratorParams> = {},
  is16thHit = false,
  name = "IsraeliBass_Chunky"
): GeneratedAudio {
  const p: BassGeneratorParams = { ...DEFAULT_BASS_PARAMS, ...customParams };
  const sr = p.sampleRate || 44100;

  // If 16th hit, default duration to ~105ms at 142bpm
  const effectiveDuration = is16thHit ? (p.duration <= 0.15 ? p.duration : 0.105) : p.duration;
  const numSamples = Math.floor(sr * effectiveDuration);
  const gateSamples = Math.floor(numSamples * p.gateRatio);
  const samples = new Float32Array(numSamples);

  const ladder = new MoogLadder4Pole(sr);
  const peakCutoff = p.filterPeak * p.accent;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;

    if (i < gateSamples) {
      // 1. Amplitude envelope: 1.5ms attack to avoid clicking, exponential decay, smooth gate release
      let amp = 0.0;
      if (t < 0.0015) {
        amp = t / 0.0015;
      } else {
        amp = Math.exp(-(t - 0.0015) * 5.8);
        const gateRem = (effectiveDuration * p.gateRatio - t) / 0.012;
        if (gateRem < 1.0) {
          amp *= Math.max(0.0, gateRem);
        }
      }

      // 2. Filter envelope: snappy downward pluck sweep
      const fc = p.filterBase + (peakCutoff - p.filterBase) * Math.exp(-t / p.filterDecay);

      // 3. Multi-oscillator source: Bandlimited Saw + Sub Sine at root pitch
      const saw = bandlimitedSaw(p.rootPitch, t, sr, 32);
      const sub = Math.sin(2.0 * Math.PI * p.rootPitch * t);
      const rawOsc = p.sawWeight * saw + p.subWeight * sub;

      // 4. 4-Pole Moog ladder filtering
      const filtered = ladder.process(rawOsc, fc, p.resonance);

      // 5. Asymmetric drive for the signature Israeli low-mid "chunk"
      const saturated = asymmetricChunkDrive(filtered * amp, p.drive, 0.16);
      samples[i] = saturated;
    } else {
      samples[i] = 0.0;
    }
  }

  applyDeclickFades(samples, 16, 64);
  const peakDb = normalizeBuffer(samples, 0.95);
  const wavBytes = encodeWav16(samples, sr, 1);
  const blob = createWavBlob(samples, sr, 1);

  return {
    name,
    soundType: is16thHit ? "bass_16th" : "bass_single",
    samples,
    sampleRate: sr,
    channels: 1,
    duration: effectiveDuration,
    wavBytes,
    blob,
    peakDb,
    toAudioBuffer(ctx: BaseAudioContext): AudioBuffer {
      const ab = ctx.createBuffer(1, samples.length, sr);
      ab.getChannelData(0).set(samples);
      return ab;
    }
  };
}
