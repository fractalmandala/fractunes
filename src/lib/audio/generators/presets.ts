/**
 * Authentic Morning & Full-On Psytrance Soundbank Presets.
 * Modeled after iconic tracks, synthesizers (Access Virus B/C, Roland JP-8000, Nord Lead), and Israeli production pioneers.
 */

import type { MorningPreset } from "./types";
import { ROOT_NOTES } from "./types";

export const MORNING_PRESETS: MorningPreset[] = [
  {
    id: "astrix_artcore",
    name: "Astrix · Artcore Morning",
    artistEra: "Astrix (2004 Full-On Golden Era)",
    key: "A1 (55.0 Hz)",
    bpm: 145,
    description: "Maximum punch beater-click kick with thick, muscular Moog 4-pole chunky rolling bass. Rock solid club foundation.",
    kick: {
      rootPitch: ROOT_NOTES["A1"],
      clickFreq: 7500,
      punchFreq: 280,
      pitchDecay: 0.072,
      volDecay: 0.165,
      punchAmount: 58,
      clickAmount: 0.85,
      drive: 1.4
    },
    bass: {
      rootPitch: ROOT_NOTES["A1"],
      filterBase: 125,
      filterPeak: 1950,
      filterDecay: 0.027,
      resonance: 1.12,
      drive: 2.4,
      gateRatio: 0.88,
      sawWeight: 0.78,
      subWeight: 0.48
    },
    hats: {
      closed: { hpCutoff: 8800, hpResonance: 2.6, decay: 0.022 },
      open: { hpCutoff: 8200, hpResonance: 2.4, decay: 0.165 }
    },
    loop: {
      bpm: 145,
      bars: 2,
      rootPitch: ROOT_NOTES["A1"],
      turnaround: "minor_third",
      accents: [0.88, 0.82, 1.08]
    }
  },
  {
    id: "yahel_voyage",
    name: "Yahel · Voyage Dawn",
    artistEra: "Yahel (Butterfly / Voyage Era)",
    key: "F1 (43.65 Hz)",
    bpm: 142,
    description: "Deep, melodic low-end with round bouncy saw bass and warm sub extension. Emotional sunrise morning character.",
    kick: {
      rootPitch: ROOT_NOTES["F1"],
      clickFreq: 6400,
      punchFreq: 240,
      pitchDecay: 0.078,
      volDecay: 0.180,
      punchAmount: 48,
      clickAmount: 0.70,
      drive: 1.25
    },
    bass: {
      rootPitch: ROOT_NOTES["F1"],
      filterBase: 110,
      filterPeak: 1750,
      filterDecay: 0.030,
      resonance: 1.05,
      drive: 2.0,
      gateRatio: 0.86,
      sawWeight: 0.72,
      subWeight: 0.52
    },
    hats: {
      closed: { hpCutoff: 8400, hpResonance: 2.2, decay: 0.025 },
      open: { hpCutoff: 8000, hpResonance: 2.2, decay: 0.180 }
    },
    loop: {
      bpm: 142,
      bars: 2,
      rootPitch: ROOT_NOTES["F1"],
      turnaround: "minor_third",
      accents: [0.86, 0.84, 1.04]
    }
  },
  {
    id: "astral_goa",
    name: "Astral Projection · Goa Sunrise",
    artistEra: "Astral Projection (90s Trust in Trance)",
    key: "G1 (49.0 Hz)",
    bpm: 140,
    description: "Sharp laser-click kick transient with squelchy, rubbery resonant Virus/Nord bass pluck. Classic melodic Goa bounce.",
    kick: {
      rootPitch: ROOT_NOTES["G1"],
      clickFreq: 7800,
      punchFreq: 260,
      pitchDecay: 0.070,
      volDecay: 0.170,
      punchAmount: 52,
      clickAmount: 0.88,
      drive: 1.35
    },
    bass: {
      rootPitch: ROOT_NOTES["G1"],
      filterBase: 130,
      filterPeak: 2200,
      filterDecay: 0.024,
      resonance: 1.28,
      drive: 2.3,
      gateRatio: 0.85,
      sawWeight: 0.82,
      subWeight: 0.40
    },
    hats: {
      closed: { hpCutoff: 9200, hpResonance: 2.8, decay: 0.020 },
      open: { hpCutoff: 8600, hpResonance: 2.5, decay: 0.150 }
    },
    loop: {
      bpm: 140,
      bars: 2,
      rootPitch: ROOT_NOTES["G1"],
      turnaround: "octave_rise",
      accents: [0.90, 0.80, 1.10]
    }
  },
  {
    id: "cosma_simplicity",
    name: "Cosma · Nonstop Simplicity",
    artistEra: "Cosma (Simplicity / Nonstop Album)",
    key: "E1 (41.2 Hz)",
    bpm: 140,
    description: "Deep organic wooden kick punch with warm, subdued, velvet analog bass. Highly revered Israeli morning production taste.",
    kick: {
      rootPitch: ROOT_NOTES["E1"],
      clickFreq: 5800,
      punchFreq: 220,
      pitchDecay: 0.082,
      volDecay: 0.185,
      punchAmount: 46,
      clickAmount: 0.65,
      drive: 1.2
    },
    bass: {
      rootPitch: ROOT_NOTES["E1"],
      filterBase: 105,
      filterPeak: 1550,
      filterDecay: 0.034,
      resonance: 0.98,
      drive: 1.9,
      gateRatio: 0.89,
      sawWeight: 0.70,
      subWeight: 0.55
    },
    hats: {
      closed: { hpCutoff: 8000, hpResonance: 2.0, decay: 0.028 },
      open: { hpCutoff: 7800, hpResonance: 2.0, decay: 0.190 }
    },
    loop: {
      bpm: 140,
      bars: 2,
      rootPitch: ROOT_NOTES["E1"],
      turnaround: "minor_third",
      accents: [0.85, 0.85, 1.02]
    }
  },
  {
    id: "electro_sun_pure",
    name: "Electro Sun · Pure Blue Energy",
    artistEra: "Electro Sun (Pure Blue / Double Trouble)",
    key: "F#1 (46.25 Hz)",
    bpm: 145,
    description: "High-octane driving 16th gallop, sizzle-heavy metallic hats, and aggressive low-mid bass bite for euphoric morning sets.",
    kick: {
      rootPitch: ROOT_NOTES["F#1"],
      clickFreq: 7200,
      punchFreq: 270,
      pitchDecay: 0.074,
      volDecay: 0.168,
      punchAmount: 55,
      clickAmount: 0.82,
      drive: 1.38
    },
    bass: {
      rootPitch: ROOT_NOTES["F#1"],
      filterBase: 120,
      filterPeak: 2000,
      filterDecay: 0.025,
      resonance: 1.15,
      drive: 2.5,
      gateRatio: 0.87,
      sawWeight: 0.80,
      subWeight: 0.44
    },
    hats: {
      closed: { hpCutoff: 9000, hpResonance: 2.6, decay: 0.022 },
      open: { hpCutoff: 8400, hpResonance: 2.6, decay: 0.155 }
    },
    loop: {
      bpm: 145,
      bars: 2,
      rootPitch: ROOT_NOTES["F#1"],
      turnaround: "minor_third",
      accents: [0.90, 0.82, 1.12]
    }
  },
  {
    id: "vibe_tribe_melodrama",
    name: "Vibe Tribe · Melodrama",
    artistEra: "Vibe Tribe (Melodrama Era)",
    key: "G1 (49.0 Hz)",
    bpm: 145,
    description: "In-your-face transient knock, snappy sub-punch, and high-energy galloping bassline designed to cut through dense synth leads.",
    kick: {
      rootPitch: ROOT_NOTES["G1"],
      clickFreq: 7600,
      punchFreq: 290,
      pitchDecay: 0.068,
      volDecay: 0.160,
      punchAmount: 60,
      clickAmount: 0.88,
      drive: 1.45
    },
    bass: {
      rootPitch: ROOT_NOTES["G1"],
      filterBase: 128,
      filterPeak: 2100,
      filterDecay: 0.024,
      resonance: 1.20,
      drive: 2.6,
      gateRatio: 0.87,
      sawWeight: 0.82,
      subWeight: 0.42
    },
    hats: {
      closed: { hpCutoff: 8800, hpResonance: 2.8, decay: 0.020 },
      open: { hpCutoff: 8500, hpResonance: 2.5, decay: 0.160 }
    },
    loop: {
      bpm: 145,
      bars: 2,
      rootPitch: ROOT_NOTES["G1"],
      turnaround: "octave_rise",
      accents: [0.92, 0.80, 1.15]
    }
  },
  {
    id: "infected_classical",
    name: "Infected Mushroom · Classical Era",
    artistEra: "Infected Mushroom (Classical / BP Empire)",
    key: "D1 (36.71 Hz)",
    bpm: 142,
    description: "Deep, growling sub register with vocal, rubbery acoustic-filtered bass modulation and tight punchy kick.",
    kick: {
      rootPitch: ROOT_NOTES["D1"] * 1.25, // tuned slightly higher for sub clarity (~45Hz)
      clickFreq: 6200,
      punchFreq: 250,
      pitchDecay: 0.076,
      volDecay: 0.175,
      punchAmount: 50,
      clickAmount: 0.75,
      drive: 1.3
    },
    bass: {
      rootPitch: ROOT_NOTES["D1"] * 1.25,
      filterBase: 115,
      filterPeak: 1800,
      filterDecay: 0.028,
      resonance: 1.25,
      drive: 2.2,
      gateRatio: 0.88,
      sawWeight: 0.75,
      subWeight: 0.50
    },
    hats: {
      closed: { hpCutoff: 8200, hpResonance: 2.4, decay: 0.026 },
      open: { hpCutoff: 7900, hpResonance: 2.3, decay: 0.170 }
    },
    loop: {
      bpm: 142,
      bars: 2,
      rootPitch: ROOT_NOTES["D1"] * 1.25,
      turnaround: "minor_third",
      accents: [0.88, 0.84, 1.06]
    }
  },
  {
    id: "sesto_sento_830",
    name: "Sesto Sento · Year 830",
    artistEra: "Sesto Sento (The Year 830 / A wise monkey)",
    key: "A1 (55.0 Hz)",
    bpm: 146,
    description: "Fast, bright, snappy morning trance energy with ultra-clean transient alignment and singing saw harmonics.",
    kick: {
      rootPitch: ROOT_NOTES["A1"],
      clickFreq: 7800,
      punchFreq: 285,
      pitchDecay: 0.065,
      volDecay: 0.158,
      punchAmount: 62,
      clickAmount: 0.90,
      drive: 1.42
    },
    bass: {
      rootPitch: ROOT_NOTES["A1"],
      filterBase: 130,
      filterPeak: 2150,
      filterDecay: 0.023,
      resonance: 1.18,
      drive: 2.5,
      gateRatio: 0.86,
      sawWeight: 0.82,
      subWeight: 0.44
    },
    hats: {
      closed: { hpCutoff: 9100, hpResonance: 2.8, decay: 0.020 },
      open: { hpCutoff: 8600, hpResonance: 2.6, decay: 0.145 }
    },
    loop: {
      bpm: 146,
      bars: 2,
      rootPitch: ROOT_NOTES["A1"],
      turnaround: "minor_third",
      accents: [0.92, 0.82, 1.14]
    }
  },
  {
    id: "prog_dawn_species",
    name: "Progressive Dawn · 135 Deep Groove",
    artistEra: "Modern Progressive Psy (Iboga / Sonic Species Style)",
    key: "F1 (43.65 Hz)",
    bpm: 135,
    description: "Slightly relaxed 135 BPM tempo with deeper sub dwell time, controlled filter resonance, and hypnotic rolling gallop.",
    kick: {
      rootPitch: ROOT_NOTES["F1"],
      clickFreq: 6000,
      punchFreq: 230,
      pitchDecay: 0.084,
      volDecay: 0.188,
      punchAmount: 44,
      clickAmount: 0.68,
      drive: 1.2
    },
    bass: {
      rootPitch: ROOT_NOTES["F1"],
      filterBase: 108,
      filterPeak: 1600,
      filterDecay: 0.035,
      resonance: 1.02,
      drive: 2.0,
      gateRatio: 0.89,
      sawWeight: 0.72,
      subWeight: 0.54
    },
    hats: {
      closed: { hpCutoff: 8000, hpResonance: 2.0, decay: 0.030 },
      open: { hpCutoff: 7600, hpResonance: 2.0, decay: 0.195 }
    },
    loop: {
      bpm: 135,
      bars: 2,
      rootPitch: ROOT_NOTES["F1"],
      turnaround: "minor_third",
      accents: [0.85, 0.86, 1.02]
    }
  }
];

export function getPresetById(id: string): MorningPreset | undefined {
  return MORNING_PRESETS.find((p) => p.id === id);
}
