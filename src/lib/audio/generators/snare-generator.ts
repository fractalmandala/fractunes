/**
 * Pure mathematical DSP synthesizer for Psytrance Snares & Claps.
 * Blends pitched body knock with high-passed noise burst and pre-clap tap transients.
 */

import {
  type SnareGeneratorParams,
  type GeneratedAudio
} from "./types";
import {
  HighPassFilter,
  softSaturate,
  normalizeBuffer,
  applyDeclickFades
} from "./dsp-primitives";
import { encodeWav16, createWavBlob } from "./wav-encoder";

export const DEFAULT_SNARE_PARAMS: SnareGeneratorParams = {
  bodyPitch: 185,
  bodyDecay: 0.065,
  noiseDecay: 0.160,
  noiseCutoff: 3400,
  snappiness: 0.70,
  sampleRate: 44100
};

export function generateSnare(
  customParams: Partial<SnareGeneratorParams> = {},
  name = "PsySnare_OneShot"
): GeneratedAudio {
  const p: SnareGeneratorParams = { ...DEFAULT_SNARE_PARAMS, ...customParams };
  const sr = p.sampleRate || 44100;
  const duration = Math.max(p.bodyDecay, p.noiseDecay) + 0.01;
  const numSamples = Math.floor(sr * duration);
  const samples = new Float32Array(numSamples);

  const hpf = new HighPassFilter(sr);

  let tonePhase = 0.0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;

    // 1. Tonal body with fast downward pitch sweep
    const currentToneFreq = p.bodyPitch * (1.0 + 1.8 * Math.exp(-t / 0.018));
    tonePhase += (2.0 * Math.PI * currentToneFreq) / sr;
    const toneAmp = Math.exp(-t / (p.bodyDecay * 0.45));
    const tone = Math.sin(tonePhase) * toneAmp * (1.0 - p.snappiness * 0.4);

    // 2. Multi-tap noise pre-delays (gives the clap/snare crunch)
    let noise = Math.random() * 2.0 - 1.0;
    if (t < 0.024) {
      // Pre-clap micro reflections at 6ms, 12ms, 18ms
      const tapMod = Math.sin((t / 0.006) * Math.PI);
      noise *= 0.8 + 0.4 * tapMod;
    }

    const filteredNoise = hpf.process(noise, p.noiseCutoff, 1.8);
    const noiseAmp = Math.exp(-t / (p.noiseDecay * 0.35));
    const noiseComponent = filteredNoise * noiseAmp * (0.6 + p.snappiness * 0.6);

    // 3. Composite signal + saturation
    const composite = tone * 0.75 + noiseComponent * 0.85;
    samples[i] = softSaturate(composite, 1.4);
  }

  applyDeclickFades(samples, 8, 48);
  const peakDb = normalizeBuffer(samples, 0.95);
  const wavBytes = encodeWav16(samples, sr, 1);
  const blob = createWavBlob(samples, sr, 1);

  return {
    name,
    soundType: "snare",
    samples,
    sampleRate: sr,
    channels: 1,
    duration,
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
