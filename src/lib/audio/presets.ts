export interface SoundbankPreset {
  id: string;
  name: string;
  artist: string;
  tempo: number;
  key: string;
  kick: {
    rootPitch: number;
    punch: number;
    clickAmount: number;
    pitchDecay: number;
    volDecay: number;
    p0: number;
    c1y: number;
    c2y: number;
  };
  hats: {
    cutoff: number;
    resonance: number;
    closedDecay: number;
    openDecay: number;
  };
  synth: {
    table: string;
    warpMode: string;
    warpAmount: number;
    unison: number;
    detune: number;
    cutoff: number;
    resonance: number;
  };
  leadArp: {
    noteScale: number[];
  };
  fx: {
    delayTime: number;
    feedback: number;
    reverbDecay: number;
    reverbWet: number;
    delayFilter: number;
  };
  pattern: number[][];
}

export const SOUNDBANK: SoundbankPreset[] = [
  {
    id: "electro_sun",
    name: "Electro Sun · Pure Blue",
    artist: "Electro Sun",
    tempo: 145,
    key: "F# Minor",
    kick: { rootPitch: 46.2, punch: 52, clickAmount: 0.8, pitchDecay: 0.072, volDecay: 0.125, p0: 7900, c1y: 1540, c2y: 110 },
    hats: { cutoff: 8800, resonance: 2.6, closedDecay: 0.022, openDecay: 0.155 },
    synth: { table: "supersaw", warpMode: "bend", warpAmount: 0.38, unison: 7, detune: 26, cutoff: 3600, resonance: 3.4 },
    leadArp: { noteScale: [185, 220, 246.9, 277.2, 329.6, 370] },
    fx: { delayTime: 0.258, feedback: 0.42, reverbDecay: 2.2, reverbWet: 0.3, delayFilter: 3200 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  },
  {
    id: "vibe_tribe",
    name: "Vibe Tribe · Melodrama",
    artist: "Vibe Tribe",
    tempo: 145,
    key: "G Minor",
    kick: { rootPitch: 49.0, punch: 58, clickAmount: 0.85, pitchDecay: 0.068, volDecay: 0.12, p0: 8200, c1y: 1660, c2y: 120 },
    hats: { cutoff: 8400, resonance: 2.8, closedDecay: 0.024, openDecay: 0.16 },
    synth: { table: "supersaw", warpMode: "sync", warpAmount: 0.42, unison: 7, detune: 28, cutoff: 3800, resonance: 4.2 },
    leadArp: { noteScale: [196, 233.1, 261.6, 293.7, 349.2, 392] },
    fx: { delayTime: 0.258, feedback: 0.46, reverbDecay: 2.4, reverbWet: 0.32, delayFilter: 3200 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,0, 0,1,1,1, 0,1,1,1],
      [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  },
  {
    id: "system_nipel",
    name: "System Nipel · Absolute",
    artist: "System Nipel",
    tempo: 144,
    key: "F Minor",
    kick: { rootPitch: 43.6, punch: 48, clickAmount: 0.75, pitchDecay: 0.078, volDecay: 0.135, p0: 7600, c1y: 1460, c2y: 105 },
    hats: { cutoff: 8200, resonance: 2.4, closedDecay: 0.025, openDecay: 0.15 },
    synth: { table: "acid_303", warpMode: "bend", warpAmount: 0.3, unison: 5, detune: 20, cutoff: 2800, resonance: 3.8 },
    leadArp: { noteScale: [174.6, 207.6, 233.1, 261.6, 311.1, 349.2] },
    fx: { delayTime: 0.26, feedback: 0.4, reverbDecay: 2.5, reverbWet: 0.35, delayFilter: 3000 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  },
  {
    id: "sesto_sento",
    name: "Sesto Sento · Year 830",
    artist: "Sesto Sento",
    tempo: 146,
    key: "A Minor",
    kick: { rootPitch: 55.0, punch: 62, clickAmount: 0.88, pitchDecay: 0.065, volDecay: 0.115, p0: 8400, c1y: 1740, c2y: 130 },
    hats: { cutoff: 8600, resonance: 3.0, closedDecay: 0.02, openDecay: 0.14 },
    synth: { table: "distorted_saw", warpMode: "fm", warpAmount: 0.5, unison: 7, detune: 25, cutoff: 3400, resonance: 4.6 },
    leadArp: { noteScale: [220, 261.6, 293.7, 329.6, 392, 440] },
    fx: { delayTime: 0.256, feedback: 0.44, reverbDecay: 2.0, reverbWet: 0.28, delayFilter: 3400 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1],
      [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  },
  {
    id: "bizarre_contact",
    name: "Bizarre Contact · Sunrise",
    artist: "Bizarre Contact",
    tempo: 144,
    key: "G# Minor",
    kick: { rootPitch: 51.9, punch: 54, clickAmount: 0.8, pitchDecay: 0.07, volDecay: 0.128, p0: 8000, c1y: 1580, c2y: 115 },
    hats: { cutoff: 9000, resonance: 2.6, closedDecay: 0.022, openDecay: 0.165 },
    synth: { table: "formant", warpMode: "pwm", warpAmount: 0.45, unison: 7, detune: 24, cutoff: 3500, resonance: 3.6 },
    leadArp: { noteScale: [207.6, 246.9, 277.2, 311.1, 370, 415.3] },
    fx: { delayTime: 0.26, feedback: 0.48, reverbDecay: 2.6, reverbWet: 0.34, delayFilter: 3200 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  },
  {
    id: "prog_dawn",
    name: "Progressive Dawn · 132 Hypnotic (Am)",
    artist: "PsyFracta Progressive",
    tempo: 132,
    key: "A Minor",
    kick: { rootPitch: 55.0, punch: 44, clickAmount: 0.65, pitchDecay: 0.08, volDecay: 0.14, p0: 7200, c1y: 1380, c2y: 110 },
    hats: { cutoff: 7800, resonance: 2.0, closedDecay: 0.03, openDecay: 0.19 },
    synth: { table: "rolling", warpMode: "bend", warpAmount: 0.3, unison: 5, detune: 18, cutoff: 2600, resonance: 2.6 },
    leadArp: { noteScale: [220, 261.6, 293.7, 329.6, 392, 440] },
    fx: { delayTime: 0.34, feedback: 0.5, reverbDecay: 3.2, reverbWet: 0.4, delayFilter: 2800 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,1],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
      [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0]
    ]
  },
  {
    id: "prog_mist",
    name: "Progressive Mist · 135 Deep (Fm)",
    artist: "PsyFracta Progressive",
    tempo: 135,
    key: "F Minor",
    kick: { rootPitch: 43.6, punch: 46, clickAmount: 0.7, pitchDecay: 0.082, volDecay: 0.14, p0: 7400, c1y: 1420, c2y: 108 },
    hats: { cutoff: 8000, resonance: 2.2, closedDecay: 0.028, openDecay: 0.18 },
    synth: { table: "formant", warpMode: "fm", warpAmount: 0.35, unison: 5, detune: 20, cutoff: 2800, resonance: 3.0 },
    leadArp: { noteScale: [174.6, 207.6, 233.1, 261.6, 311.1, 349.2] },
    fx: { delayTime: 0.333, feedback: 0.48, reverbDecay: 3.0, reverbWet: 0.38, delayFilter: 2900 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,1,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0]
    ]
  },
  {
    id: "prog_sunrise",
    name: "Progressive Sunrise · 138 Groove (Gm)",
    artist: "PsyFracta Progressive",
    tempo: 138,
    key: "G Minor",
    kick: { rootPitch: 49.0, punch: 50, clickAmount: 0.75, pitchDecay: 0.075, volDecay: 0.132, p0: 7600, c1y: 1500, c2y: 112 },
    hats: { cutoff: 8400, resonance: 2.4, closedDecay: 0.026, openDecay: 0.17 },
    synth: { table: "supersaw", warpMode: "pwm", warpAmount: 0.38, unison: 6, detune: 22, cutoff: 3200, resonance: 3.2 },
    leadArp: { noteScale: [196, 233.1, 261.6, 293.7, 349.2, 392] },
    fx: { delayTime: 0.326, feedback: 0.46, reverbDecay: 2.8, reverbWet: 0.36, delayFilter: 3000 },
    pattern: [
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,0],
      [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,1,1],
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
    ]
  }
];
