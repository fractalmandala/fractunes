/**
 * Svelte 5 Reactive Store for the Morning Psytrance Generator Engine.
 * Manages generator state, presets, audition playback, and export pipelines.
 */

import {
  type SoundType,
  type KickGeneratorParams,
  type BassGeneratorParams,
  type HatGeneratorParams,
  type SnareGeneratorParams,
  type LoopGeneratorParams,
  type GeneratedAudio,
  ROOT_NOTES
} from "../audio/generators/types";
import { DEFAULT_KICK_PARAMS } from "../audio/generators/kick-generator";
import { DEFAULT_BASS_PARAMS } from "../audio/generators/bass-generator";
import { DEFAULT_HAT_PARAMS } from "../audio/generators/hat-generator";
import { DEFAULT_SNARE_PARAMS } from "../audio/generators/snare-generator";
import { DEFAULT_LOOP_PARAMS } from "../audio/generators/loop-generator";
import { MORNING_PRESETS, getPresetById } from "../audio/generators/presets";
import { PsyGeneratorEngine } from "../audio/generators/psy-generator";
import { synthStore } from "./synthStore.svelte";

export class GeneratorStore {
  engine = new PsyGeneratorEngine();
  private audioCtx: AudioContext | null = null;

  // Selected sound type
  soundType = $state<SoundType>("kick");

  // Active preset
  activePresetId = $state<string>("astrix_artcore");

  // Global musical parameters
  bpm = $state<number>(145);
  rootNote = $state<string>("A1");
  rootPitch = $state<number>(55.0);

  // Individual generator parameter states
  kick = $state<KickGeneratorParams>({ ...DEFAULT_KICK_PARAMS, rootPitch: 55.0 });
  bass = $state<BassGeneratorParams>({ ...DEFAULT_BASS_PARAMS, rootPitch: 55.0 });
  hat = $state<HatGeneratorParams>({ ...DEFAULT_HAT_PARAMS });
  snare = $state<SnareGeneratorParams>({ ...DEFAULT_SNARE_PARAMS });
  loop = $state<LoopGeneratorParams>({ ...DEFAULT_LOOP_PARAMS, bpm: 145, rootPitch: 55.0 });

  // Playback & Export state
  lastGenerated = $state<GeneratedAudio | null>(null);
  isGenerating = $state<boolean>(false);
  isPlaying = $state<boolean>(false);
  exportStatus = $state<string | null>(null);

  constructor() {
    this.loadPreset("astrix_artcore");
  }

  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx!;
  }

  /**
   * Set musical root note and update all linked generators
   */
  setRootNote(noteKey: string) {
    if (ROOT_NOTES[noteKey]) {
      this.rootNote = noteKey;
      const freq = ROOT_NOTES[noteKey];
      this.rootPitch = freq;
      this.kick.rootPitch = freq;
      this.bass.rootPitch = freq;
      this.loop.rootPitch = freq;
    }
  }

  /**
   * Set BPM and update loop generator
   */
  setBpm(val: number) {
    this.bpm = Math.max(120, Math.min(160, val));
    this.loop.bpm = this.bpm;
  }

  /**
   * Load a curated Morning Psytrance Preset
   */
  loadPreset(id: string) {
    const p = getPresetById(id);
    if (!p) return;

    this.activePresetId = id;
    this.bpm = p.bpm;
    this.loop.bpm = p.bpm;

    if (p.kick.rootPitch) {
      this.rootPitch = p.kick.rootPitch;
      // Find matching root note key
      for (const [key, freq] of Object.entries(ROOT_NOTES)) {
        if (Math.abs(freq - p.kick.rootPitch) < 0.5) {
          this.rootNote = key;
          break;
        }
      }
    }

    this.kick = { ...DEFAULT_KICK_PARAMS, ...p.kick, rootPitch: this.rootPitch };
    this.bass = { ...DEFAULT_BASS_PARAMS, ...p.bass, rootPitch: this.rootPitch };
    this.hat = { ...DEFAULT_HAT_PARAMS, ...p.hats.closed };
    this.loop = {
      ...DEFAULT_LOOP_PARAMS,
      ...p.loop,
      bpm: this.bpm,
      rootPitch: this.rootPitch,
      kickParams: this.kick,
      bassParams: this.bass
    };
  }

  /**
   * Generate audio for the selected sound type using current parameters
   */
  generate(type?: SoundType): GeneratedAudio {
    this.isGenerating = true;
    const targetType = type || this.soundType;
    let audio: GeneratedAudio;

    switch (targetType) {
      case "kick":
        audio = this.engine.generateKick(this.kick, `${this.activePresetId}_kick_${this.rootNote}`);
        break;

      case "bass_single":
        audio = this.engine.generateBass(
          { ...this.bass, duration: 0.40 },
          false,
          `${this.activePresetId}_bass_single_${this.rootNote}`
        );
        break;

      case "bass_16th":
        audio = this.engine.generateBass(
          this.bass,
          true,
          `${this.activePresetId}_bass_16th_${this.rootNote}`
        );
        break;

      case "hat_closed":
        audio = this.engine.generateHat(
          { ...this.hat, isOpen: false },
          false,
          `${this.activePresetId}_hat_closed`
        );
        break;

      case "hat_open":
        audio = this.engine.generateHat(
          { ...this.hat, isOpen: true, decay: 0.165 },
          true,
          `${this.activePresetId}_hat_open`
        );
        break;

      case "snare":
        audio = this.engine.generateSnare(
          this.snare,
          `${this.activePresetId}_snare`
        );
        break;

      case "loop_kbbb":
        audio = this.engine.generateLoop(
          {
            ...this.loop,
            bpm: this.bpm,
            rootPitch: this.rootPitch,
            patternType: "kbbb_classic",
            kickParams: this.kick,
            bassParams: this.bass
          },
          `${this.activePresetId}_loop_kbbb_${this.bpm}BPM`
        );
        break;

      case "loop_full":
      default:
        audio = this.engine.generateLoop(
          {
            ...this.loop,
            bpm: this.bpm,
            rootPitch: this.rootPitch,
            patternType: "full_morning",
            kickParams: this.kick,
            bassParams: this.bass,
            hatClosedParams: { ...this.hat, isOpen: false },
            hatOpenParams: { ...this.hat, isOpen: true, decay: 0.165 },
            snareParams: this.snare
          },
          `${this.activePresetId}_loop_full_${this.bpm}BPM`
        );
        break;
    }

    this.lastGenerated = audio;
    this.isGenerating = false;
    return audio;
  }

  /**
   * Audition the currently generated sound (or generate a fresh one and play it)
   */
  audition(type?: SoundType) {
    const ctx = this.ensureAudioContext();
    const audio = this.generate(type);
    this.isPlaying = true;
    const src = this.engine.audition(audio, ctx);
    src.onended = () => {
      this.isPlaying = false;
    };
  }

  /**
   * Stop any playing audition immediately
   */
  stopAudition() {
    this.engine.stopAudition();
    this.isPlaying = false;
  }

  /**
   * Export the currently generated sound as a 16-bit PCM WAV file
   */
  async exportWav(filename?: string): Promise<{ success: boolean; path?: string }> {
    if (!this.lastGenerated) {
      this.generate();
    }
    if (!this.lastGenerated) return { success: false };

    this.exportStatus = "Exporting WAV...";
    const res = await this.engine.exportWav(this.lastGenerated, filename);
    this.exportStatus = res.success ? `Saved: ${res.path}` : "Export failed";

    setTimeout(() => {
      this.exportStatus = null;
    }, 4000);

    return res;
  }

  /**
   * Export a complete 8-piece sample pack for the active preset
   */
  async exportSamplePack(): Promise<string[]> {
    this.exportStatus = "Exporting Sample Pack (8 WAVs)...";
    const paths = await this.engine.exportSamplePack(this.activePresetId);
    this.exportStatus = `Exported ${paths.length} files to PsyFracta_Exports!`;

    setTimeout(() => {
      this.exportStatus = null;
    }, 5000);

    return paths;
  }

  /**
   * Sync the current generator parameters into Fractunes' main rack sequencer
   */
  syncToMainRack() {
    synthStore.tempo = this.bpm;
    synthStore.kickPitch = this.kick.rootPitch;
    synthStore.kickPunch = this.kick.punchAmount;
    synthStore.kickPitchDec = Math.round(this.kick.pitchDecay * 1000);
    synthStore.kickVolDec = Math.round(this.kick.volDecay * 1000);

    synthStore.hatCutoff = this.hat.hpCutoff / 1000;
    synthStore.hatRes = this.hat.hpResonance;
    synthStore.hatClDec = Math.round(this.hat.decay * 1000);

    synthStore.filterCutoff = this.bass.filterPeak / 1000;
    synthStore.filterRes = this.bass.resonance * 2.8;
    synthStore.filterDecay = Math.round(this.bass.filterDecay * 1000);

    // Apply to live engines
    synthStore.ensureAudio();
    if (synthStore.engine.kick) {
      synthStore.engine.kick.setTuning(this.kick.rootPitch);
      synthStore.engine.kick.setPunch(this.kick.punchAmount);
      synthStore.engine.kick.pitchDecay = this.kick.pitchDecay;
      synthStore.engine.kick.volDecay = this.kick.volDecay;
    }
    if (synthStore.engine.synth) {
      synthStore.engine.synth.cutoff = this.bass.filterPeak;
      synthStore.engine.synth.resonance = this.bass.resonance * 2.8;
      synthStore.engine.synth.filterDecay = Math.round(this.bass.filterDecay * 1000);
    }
  }
}

export const generatorStore = new GeneratorStore();
