/**
 * Pure mathematical DSP synthesizer for Metallic Psytrance Hi-Hats.
 * Generates both snappy Closed Hats and sizzling Open Hats with choke capability.
 */

import {
  type HatGeneratorParams,
  type GeneratedAudio
} from "./types";
import {
  HighPassFilter,
  softSaturate,
  normalizeBuffer,
  applyDeclickFades
} from "./dsp-primitives";
import { encodeWav16, createWavBlob } from "./wav-encoder";

export const DEFAULT_HAT_PARAMS: HatGeneratorParams = {
  isOpen: false,
  clusterFreqs: [300, 460, 620, 810, 1050, 1420],
  clusterWeight: 0.28,
  noiseWeight: 0.72,
  hpCutoff: 8600,
  hpResonance: 2.4,
  decay: 0.026,
  sampleRate: 44100
};

export function generateHat(
  customParams: Partial<HatGeneratorParams> = {},
  isOpen = false,
  name?: string
): GeneratedAudio {
  const p: HatGeneratorParams = {
    ...DEFAULT_HAT_PARAMS,
    ...customParams,
    isOpen: customParams.isOpen ?? isOpen
  };

  const decay = p.isOpen ? (customParams.decay || 0.165) : (customParams.decay || 0.026);
  const sr = p.sampleRate || 44100;
  const numSamples = Math.floor(sr * (decay + 0.005));
  const samples = new Float32Array(numSamples);

  const hpf = new HighPassFilter(sr);
  const freqs = p.clusterFreqs || DEFAULT_HAT_PARAMS.clusterFreqs!;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;

    // 1. Inharmonic square wave cluster
    let cluster = 0.0;
    for (let fIdx = 0; fIdx < freqs.length; fIdx++) {
      const f = freqs[fIdx] * 2.8;
      // Square wave: sign of sine
      const sq = Math.sin(2.0 * Math.PI * f * t) >= 0 ? 1.0 : -1.0;
      cluster += sq;
    }
    cluster = (cluster / freqs.length) * p.clusterWeight;

    // 2. Uniform white noise burst
    const noise = (Math.random() * 2.0 - 1.0) * p.noiseWeight;

    const rawSignal = cluster + noise;

    // 3. Resonant High-Pass Filtering
    const filtered = hpf.process(rawSignal, p.hpCutoff, p.hpResonance);

    // 4. Amplitude decay envelope
    const amp = Math.exp(-t / (decay * 0.32));
    const tailFade = Math.max(0.0, 1.0 - t / decay);

    samples[i] = softSaturate(filtered * amp * tailFade, 1.25);
  }

  applyDeclickFades(samples, 8, 32);
  const peakDb = normalizeBuffer(samples, 0.95);
  const wavBytes = encodeWav16(samples, sr, 1);
  const blob = createWavBlob(samples, sr, 1);

  const finalName = name || (p.isOpen ? "PsyHat_Open" : "PsyHat_Closed");

  return {
    name: finalName,
    soundType: p.isOpen ? "hat_open" : "hat_closed",
    samples,
    sampleRate: sr,
    channels: 1,
    duration: decay,
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
