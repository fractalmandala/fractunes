/**
 * Types and interfaces for the Morning Psytrance Generator Engine
 */

export type SoundType =
  | "kick"
  | "bass_single"
  | "bass_16th"
  | "hat_closed"
  | "hat_open"
  | "snare"
  | "loop_kbbb"
  | "loop_full"
  | "loop_top";

export type LoopPatternType =
  | "kbbb_classic"    // K - B - B - B
  | "kbbb_driving"    // K - B(accent) - B - B(accent)
  | "kbbb_reverse"    // B - B - B - K
  | "kb_offbeat"      // K - B - K - B
  | "full_morning"    // K - B - B - B + Hats + Snare + Melodic Arp
  | "top_drums";      // Hats + Snare + Percussion without Kick/Bass

export type TurnaroundType =
  | "none"
  | "minor_third"     // Melodic rise on step 15 (+3 semitones)
  | "octave_rise"     // Octave pop on step 14-15 (+12 semitones)
  | "accent_roll"     // Triplet/double roll on step 14-16
  | "step_cut";       // Gated pause before next downbeat

export interface MusicalNote {
  note: string;
  octave: number;
  freq: number;
}

export const ROOT_NOTES: Record<string, number> = {
  "D1": 36.71,
  "D#1": 38.89,
  "Eb1": 38.89,
  "E1": 41.20,
  "F1": 43.65,
  "F#1": 46.25,
  "Gb1": 46.25,
  "G1": 48.999,
  "G#1": 51.91,
  "Ab1": 51.91,
  "A1": 55.00,
  "A#1": 58.27,
  "Bb1": 58.27,
  "B1": 61.74,
  "C2": 65.41
};

export interface KickGeneratorParams {
  rootPitch: number;      // Target sub fundamental (Hz, e.g. 48.999 for G1, 55 for A1)
  clickFreq: number;      // Initial beater click frequency (Hz, 5000-8000)
  punchFreq: number;      // Body punch transition frequency (Hz, 200-340)
  clickDecay: number;     // Fast click time constant (sec, 0.002-0.005)
  pitchDecay: number;     // Pitch sweep decay time (sec, 0.06-0.09)
  volDecay: number;       // Overall volume decay time (sec, 0.12-0.22)
  punchAmount: number;    // Mid-range punch emphasis (0-100)
  clickAmount: number;    // Transient click burst volume (0-1)
  drive: number;          // Tanh soft saturation drive (1.0-2.2)
  sampleRate?: number;    // Default 44100
}

export interface BassGeneratorParams {
  rootPitch: number;      // Fundamental note frequency (Hz)
  duration: number;       // Total audio length (sec, e.g. 0.105 for 16th, 0.40 for single note)
  gateRatio: number;      // Gate length percentage (0.6 - 0.95)
  sawWeight: number;      // Sawtooth oscillator level (0-1)
  subWeight: number;      // Dedicated Sub-Sine oscillator level (0-1)
  filterBase: number;     // 4-pole low-pass floor frequency (Hz, 100-240)
  filterPeak: number;     // 4-pole low-pass pluck start frequency (Hz, 800-2400)
  filterDecay: number;    // Filter envelope decay time (sec, 0.02-0.05)
  resonance: number;      // Moog ladder resonance (Q, 0.7-1.5, warm & non-ringing)
  drive: number;          // Asymmetric low-mid saturation drive (1.0-2.8)
  accent: number;         // Velocity multiplier (0.5-1.5)
  sampleRate?: number;    // Default 44100
}

export interface HatGeneratorParams {
  isOpen: boolean;        // Closed (staccato) vs Open (sizzle)
  clusterFreqs?: number[];// Inharmonic square cluster frequencies
  clusterWeight: number;  // Metallic cluster volume (0-1)
  noiseWeight: number;    // White noise burst volume (0-1)
  hpCutoff: number;       // High-pass filter cutoff (Hz, 6500-10500)
  hpResonance: number;    // High-pass filter Q (1.0-4.0)
  decay: number;          // Decay duration (sec: closed ~0.025, open ~0.16)
  sampleRate?: number;    // Default 44100
}

export interface SnareGeneratorParams {
  bodyPitch: number;      // Fundamental body tone (Hz, 150-250)
  bodyDecay: number;      // Tone decay time (sec, 0.04-0.10)
  noiseDecay: number;     // Snare wire noise decay (sec, 0.10-0.22)
  noiseCutoff: number;    // Bandpass/highpass noise center (Hz, 2000-5000)
  snappiness: number;     // Click / initial snap ratio (0-1)
  sampleRate?: number;    // Default 44100
}

export interface LoopGeneratorParams {
  bpm: number;            // Tempo (135-150 BPM)
  bars: 1 | 2 | 4;        // Loop length
  rootPitch: number;      // Key fundamental (Hz)
  patternType: LoopPatternType;
  turnaround: TurnaroundType;
  accents: [number, number, number]; // Accents for 16th sub-beats 1, 2, 3
  kickParams: KickGeneratorParams;
  bassParams: BassGeneratorParams;
  hatClosedParams: HatGeneratorParams;
  hatOpenParams: HatGeneratorParams;
  snareParams?: SnareGeneratorParams;
  sampleRate?: number;
}

export interface MorningPreset {
  id: string;
  name: string;
  artistEra: string;
  key: string;
  bpm: number;
  description: string;
  kick: Partial<KickGeneratorParams>;
  bass: Partial<BassGeneratorParams>;
  hats: {
    closed: Partial<HatGeneratorParams>;
    open: Partial<HatGeneratorParams>;
  };
  loop: Partial<LoopGeneratorParams>;
}

export interface GeneratedAudio {
  name: string;
  soundType: SoundType;
  samples: Float32Array;
  sampleRate: number;
  channels: number;
  duration: number;
  wavBytes: Uint8Array;
  blob: Blob;
  peakDb: number;
  toAudioBuffer(ctx: BaseAudioContext): AudioBuffer;
}
