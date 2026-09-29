/**
 * Pure mathematical DSP synthesizer for Psytrance Kicks.
 * Produces crisp, laser-click transient punch with rock-solid sub fundamentals.
 */

import {
  type KickGeneratorParams,
  type GeneratedAudio
} from "./types";
import {
  softSaturate,
  normalizeBuffer,
  applyDeclickFades
} from "./dsp-primitives";
import { encodeWav16, createWavBlob } from "./wav-encoder";

export const DEFAULT_KICK_PARAMS: KickGeneratorParams = {
  rootPitch: 48.999, // G1
  clickFreq: 6800,   // High beater transient
  punchFreq: 260,    // Body chest knock
  clickDecay: 0.0035,// Transient time constant
  pitchDecay: 0.075, // Pitch sweep duration
  volDecay: 0.170,   // Total kick length
  punchAmount: 50,
  clickAmount: 0.75,
  drive: 1.35,
  sampleRate: 44100
};

export function generateKick(
  customParams: Partial<KickGeneratorParams> = {},
  name = "PsyKick_OneShot"
): GeneratedAudio {
  const p: KickGeneratorParams = { ...DEFAULT_KICK_PARAMS, ...customParams };
  const sr = p.sampleRate || 44100;
  const numSamples = Math.floor(sr * p.volDecay);
  const samples = new Float32Array(numSamples);

  let phase = 0.0;
  const punchTransition = p.punchFreq * (1.0 + (p.punchAmount - 50) * 0.008);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;

    // 1. Dual-exponential pitch sweep curve
    const fClickDrop = (p.clickFreq - punchTransition) * Math.exp(-t / p.clickDecay);
    const fPunchDrop = (punchTransition - p.rootPitch) * Math.exp(-t / (p.pitchDecay * 0.4));
    const currentFreq = Math.max(p.rootPitch, fClickDrop + fPunchDrop + p.rootPitch);

    // 2. Continuous phase accumulation
    phase += (2.0 * Math.PI * currentFreq) / sr;
    let sig = Math.sin(phase);

    // 3. Ultra-fast beater click transient burst (first 3.5ms)
    if (t < 0.004 && p.clickAmount > 0.01) {
      const clickEnv = Math.exp(-t / 0.001);
      const clickSine = Math.sin(2.0 * Math.PI * 4200.0 * t);
      sig += clickSine * clickEnv * (p.clickAmount * 0.45);
    }

    // 4. Amplitude envelope with natural concave decay and zero tail
    const tNorm = t / p.volDecay;
    const expDecay = Math.exp(-t * (9.0 / (p.volDecay / 0.17)));
    const tailFade = 1.0 - tNorm * tNorm;
    const amp = Math.max(0.0, expDecay * tailFade);

    sig *= amp;

    // 5. Analog tanh waveshaping
    samples[i] = softSaturate(sig, p.drive);
  }

  applyDeclickFades(samples, 8, 96);
  const peakDb = normalizeBuffer(samples, 0.95);
  const wavBytes = encodeWav16(samples, sr, 1);
  const blob = createWavBlob(samples, sr, 1);

  return {
    name,
    soundType: "kick",
    samples,
    sampleRate: sr,
    channels: 1,
    duration: p.volDecay,
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
