/**
 * Pure mathematical DSP loop generator for Israeli Morning & Full-On Psytrance.
 * Renders seamless 1, 2, and 4-bar loops with authentic rolling 16th accents and turnarounds.
 */

import {
  type LoopGeneratorParams,
  type GeneratedAudio
} from "./types";
import { generateKick, DEFAULT_KICK_PARAMS } from "./kick-generator";
import { generateBass, DEFAULT_BASS_PARAMS } from "./bass-generator";
import { generateHat, DEFAULT_HAT_PARAMS } from "./hat-generator";
import { generateSnare, DEFAULT_SNARE_PARAMS } from "./snare-generator";
import { normalizeBuffer, applyDeclickFades } from "./dsp-primitives";
import { encodeWav16, createWavBlob } from "./wav-encoder";

export const DEFAULT_LOOP_PARAMS: LoopGeneratorParams = {
  bpm: 142,
  bars: 2,
  rootPitch: 48.999, // G1
  patternType: "kbbb_classic",
  turnaround: "minor_third",
  accents: [0.88, 0.82, 1.05], // 16th sub-beat 1 (mid), 2 (light), 3 (heavy push)
  kickParams: DEFAULT_KICK_PARAMS,
  bassParams: DEFAULT_BASS_PARAMS,
  hatClosedParams: DEFAULT_HAT_PARAMS,
  hatOpenParams: { ...DEFAULT_HAT_PARAMS, isOpen: true, decay: 0.165 },
  snareParams: DEFAULT_SNARE_PARAMS,
  sampleRate: 44100
};

export function generateLoop(
  customParams: Partial<LoopGeneratorParams> = {},
  name?: string
): GeneratedAudio {
  const p: LoopGeneratorParams = {
    ...DEFAULT_LOOP_PARAMS,
    ...customParams,
    accents: customParams.accents || DEFAULT_LOOP_PARAMS.accents
  };

  const sr = p.sampleRate || 44100;
  const secondsPerBeat = 60.0 / p.bpm;
  const sixteenthDur = secondsPerBeat / 4.0;
  const totalBeats = p.bars * 4;
  const totalDuration = totalBeats * secondsPerBeat;
  const totalSamples = Math.floor(sr * totalDuration);

  const masterMix = new Float32Array(totalSamples);

  // Pre-generate kick (shortened slightly to ~170ms so it doesn't fight 16th #1)
  const kickAudio = generateKick({
    ...p.kickParams,
    rootPitch: p.rootPitch,
    volDecay: Math.min(p.kickParams.volDecay || 0.17, sixteenthDur * 1.7)
  });

  // Pre-generate hats
  const closedHatAudio = generateHat({ ...p.hatClosedParams, isOpen: false });
  const openHatAudio = generateHat({ ...p.hatOpenParams, isOpen: true });

  // Pre-generate snare
  const snareAudio = generateSnare(p.snareParams);

  // Helper to mix buffer into masterMix at target sample index
  const mixIn = (source: Float32Array, startSample: number, gain = 1.0) => {
    const end = Math.min(totalSamples, startSample + source.length);
    for (let i = startSample; i < end; i++) {
      masterMix[i] += source[i - startSample] * gain;
    }
  };

  const isFullGroove = p.patternType === "full_morning";
  const isTopDrums = p.patternType === "top_drums";

  for (let beat = 0; beat < totalBeats; beat++) {
    const beatStartSample = Math.floor(beat * secondsPerBeat * sr);

    // 1. KICK (on 16th sub-beat 0 of every quarter note)
    if (!isTopDrums) {
      mixIn(kickAudio.samples, beatStartSample, 1.0);
    }

    // 2. SNARE / CLAP (on beats 2 and 4: i.e. beat % 2 === 1)
    if ((isFullGroove || isTopDrums) && beat % 2 === 1) {
      mixIn(snareAudio.samples, beatStartSample, 0.72);
    }

    // 3. HI-HATS
    if (isFullGroove || isTopDrums) {
      // Open Hat on upbeat (16th sub-beat 2)
      const openHatSample = beatStartSample + Math.floor(2 * sixteenthDur * sr);
      mixIn(openHatAudio.samples, openHatSample, 0.60);

      // Closed Hats on 16ths 1 and 3
      const ch1Sample = beatStartSample + Math.floor(1 * sixteenthDur * sr);
      const ch3Sample = beatStartSample + Math.floor(3 * sixteenthDur * sr);
      mixIn(closedHatAudio.samples, ch1Sample, 0.42);
      mixIn(closedHatAudio.samples, ch3Sample, 0.45);
    }

    // 4. ROLLING BASS (on 16th sub-beats 1, 2, 3)
    if (!isTopDrums) {
      const isTurnaroundBeat = beat === totalBeats - 1;

      for (let sub = 1; sub < 4; sub++) {
        const subStartSample = beatStartSample + Math.floor(sub * sixteenthDur * sr);
        let notePitch = p.rootPitch;
        let accentScale = p.accents[sub - 1] ?? 1.0;

        // Apply turnarounds on final beat of the loop
        if (isTurnaroundBeat) {
          if (p.turnaround === "minor_third") {
            if (sub === 2) notePitch = p.rootPitch * Math.pow(2.0, 2.0 / 12.0); // Major 2nd
            if (sub === 3) notePitch = p.rootPitch * Math.pow(2.0, 3.0 / 12.0); // Minor 3rd
            accentScale *= 1.15;
          } else if (p.turnaround === "octave_rise") {
            if (sub >= 2) notePitch = p.rootPitch * 2.0; // Octave pop
            accentScale *= 1.20;
          } else if (p.turnaround === "accent_roll") {
            accentScale *= 1.25;
          }
        }

        const bassAudio = generateBass(
          {
            ...p.bassParams,
            rootPitch: notePitch,
            duration: sixteenthDur,
            gateRatio: p.bassParams.gateRatio || 0.88,
            accent: accentScale
          },
          true
        );

        mixIn(bassAudio.samples, subStartSample, 0.86);
      }
    }
  }

  // Crossfade boundary (48 samples) for seamless zero-click looping in DAWs
  applyDeclickFades(masterMix, 32, 64);
  const peakDb = normalizeBuffer(masterMix, 0.95);
  const wavBytes = encodeWav16(masterMix, sr, 1);
  const blob = createWavBlob(masterMix, sr, 1);

  const loopTypeName = isFullGroove ? "FullGroove" : isTopDrums ? "TopDrums" : "KBBB_Loop";
  const finalName = name || `Psy_${loopTypeName}_${p.bpm}BPM_${p.bars}Bars`;

  return {
    name: finalName,
    soundType: isFullGroove ? "loop_full" : isTopDrums ? "loop_top" : "loop_kbbb",
    samples: masterMix,
    sampleRate: sr,
    channels: 1,
    duration: totalDuration,
    wavBytes,
    blob,
    peakDb,
    toAudioBuffer(ctx: BaseAudioContext): AudioBuffer {
      const ab = ctx.createBuffer(1, masterMix.length, sr);
      ab.getChannelData(0).set(masterMix);
      return ab;
    }
  };
}
