/**
 * Unified Facade for the Morning Psytrance Generator Engine.
 * Handles generation, web audio auditioning, and dual-mode export (Tauri native disk writer or Web browser download).
 */

import type {
  SoundType,
  KickGeneratorParams,
  BassGeneratorParams,
  HatGeneratorParams,
  SnareGeneratorParams,
  LoopGeneratorParams,
  GeneratedAudio
} from "./types";
import { generateKick, DEFAULT_KICK_PARAMS } from "./kick-generator";
import { generateBass, DEFAULT_BASS_PARAMS } from "./bass-generator";
import { generateHat, DEFAULT_HAT_PARAMS } from "./hat-generator";
import { generateSnare, DEFAULT_SNARE_PARAMS } from "./snare-generator";
import { generateLoop, DEFAULT_LOOP_PARAMS } from "./loop-generator";
import { MORNING_PRESETS, getPresetById } from "./presets";
import { downloadWavBlob } from "./wav-encoder";
import { exportWavNative } from "$lib/native/tauriBridge";

export class PsyGeneratorEngine {
  private activeSource: AudioBufferSourceNode | null = null;

  /**
   * Synthesize a Psytrance Kick One-Shot
   */
  generateKick(params?: Partial<KickGeneratorParams>, name?: string): GeneratedAudio {
    return generateKick(params, name);
  }

  /**
   * Synthesize a Chunky Israeli Bass Note (sustained or 16th hit)
   */
  generateBass(
    params?: Partial<BassGeneratorParams>,
    is16thHit = false,
    name?: string
  ): GeneratedAudio {
    return generateBass(params, is16thHit, name);
  }

  /**
   * Synthesize a Metallic Hi-Hat (Closed or Open)
   */
  generateHat(
    params?: Partial<HatGeneratorParams>,
    isOpen = false,
    name?: string
  ): GeneratedAudio {
    return generateHat(params, isOpen, name);
  }

  /**
   * Synthesize a Psytrance Snare / Clap One-Shot
   */
  generateSnare(params?: Partial<SnareGeneratorParams>, name?: string): GeneratedAudio {
    return generateSnare(params, name);
  }

  /**
   * Synthesize a seamless Psytrance Loop (K-B-B-B, Full Groove, or Top Drums)
   */
  generateLoop(params?: Partial<LoopGeneratorParams>, name?: string): GeneratedAudio {
    return generateLoop(params, name);
  }

  /**
   * Synthesize a sound element from a predefined Morning Psytrance preset
   */
  generateFromPreset(
    presetId: string,
    soundType: SoundType,
    overrides: {
      kick?: Partial<KickGeneratorParams>;
      bass?: Partial<BassGeneratorParams>;
      hats?: Partial<HatGeneratorParams>;
      snare?: Partial<SnareGeneratorParams>;
      loop?: Partial<LoopGeneratorParams>;
    } = {}
  ): GeneratedAudio {
    const preset = getPresetById(presetId) || MORNING_PRESETS[0];

    switch (soundType) {
      case "kick":
        return this.generateKick(
          { ...preset.kick, ...overrides.kick },
          `${preset.id}_kick`
        );

      case "bass_single":
        return this.generateBass(
          { ...preset.bass, duration: 0.40, ...overrides.bass },
          false,
          `${preset.id}_bass_single`
        );

      case "bass_16th":
        return this.generateBass(
          { ...preset.bass, ...overrides.bass },
          true,
          `${preset.id}_bass_16th`
        );

      case "hat_closed":
        return this.generateHat(
          { ...preset.hats.closed, isOpen: false, ...overrides.hats },
          false,
          `${preset.id}_hat_closed`
        );

      case "hat_open":
        return this.generateHat(
          { ...preset.hats.open, isOpen: true, ...overrides.hats },
          true,
          `${preset.id}_hat_open`
        );

      case "snare":
        return this.generateSnare(
          overrides.snare,
          `${preset.id}_snare`
        );

      case "loop_kbbb":
        return this.generateLoop(
          {
            ...preset.loop,
            patternType: "kbbb_classic",
            kickParams: { ...DEFAULT_KICK_PARAMS, ...preset.kick, ...overrides.kick },
            bassParams: { ...DEFAULT_BASS_PARAMS, ...preset.bass, ...overrides.bass },
            hatClosedParams: { ...DEFAULT_HAT_PARAMS, ...preset.hats.closed },
            hatOpenParams: { ...DEFAULT_HAT_PARAMS, isOpen: true, ...preset.hats.open },
            ...overrides.loop
          },
          `${preset.id}_loop_kbbb`
        );

      case "loop_full":
      default:
        return this.generateLoop(
          {
            ...preset.loop,
            patternType: "full_morning",
            kickParams: { ...DEFAULT_KICK_PARAMS, ...preset.kick, ...overrides.kick },
            bassParams: { ...DEFAULT_BASS_PARAMS, ...preset.bass, ...overrides.bass },
            hatClosedParams: { ...DEFAULT_HAT_PARAMS, ...preset.hats.closed },
            hatOpenParams: { ...DEFAULT_HAT_PARAMS, isOpen: true, ...preset.hats.open },
            snareParams: { ...DEFAULT_SNARE_PARAMS, ...overrides.snare },
            ...overrides.loop
          },
          `${preset.id}_loop_full_groove`
        );
    }
  }

  /**
   * Generates a complete 8-piece cohesive Morning Psytrance sample pack from a preset.
   */
  generateSamplePack(presetId: string): GeneratedAudio[] {
    const p = getPresetById(presetId) || MORNING_PRESETS[0];

    return [
      this.generateFromPreset(p.id, "kick"),
      this.generateFromPreset(p.id, "bass_single"),
      this.generateFromPreset(p.id, "bass_16th"),
      this.generateFromPreset(p.id, "hat_closed"),
      this.generateFromPreset(p.id, "hat_open"),
      this.generateFromPreset(p.id, "snare"),
      this.generateFromPreset(p.id, "loop_kbbb"),
      this.generateFromPreset(p.id, "loop_full")
    ];
  }

  /**
   * Auditions the generated audio in the browser via Web Audio API.
   * Cancels any previously playing audition to prevent overlapping noise.
   */
  audition(audio: GeneratedAudio, ctx: BaseAudioContext): AudioBufferSourceNode {
    this.stopAudition();

    const buffer = audio.toAudioBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();

    this.activeSource = source;
    source.onended = () => {
      if (this.activeSource === source) {
        this.activeSource = null;
      }
    };

    return source;
  }

  /**
   * Stops the current audition playback immediately.
   */
  stopAudition(): void {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // already stopped
      }
      this.activeSource = null;
    }
  }

  /**
   * Exports a single audio file.
   * Uses Tauri native disk writer if running inside desktop Tauri, else initiates a browser download.
   */
  async exportWav(audio: GeneratedAudio, filename?: string): Promise<{ success: boolean; path?: string }> {
    const name = filename || `${audio.name}.wav`;
    const finalFilename = name.endsWith(".wav") ? name : `${name}.wav`;

    // 1. Try native Tauri export
    try {
      const nativeRes = await exportWavNative(
        finalFilename,
        audio.samples,
        audio.sampleRate,
        audio.channels
      );
      if (nativeRes && nativeRes.success) {
        return { success: true, path: nativeRes.path };
      }
    } catch (e) {
      console.warn("Tauri native export unavailable, falling back to browser download:", e);
    }

    // 2. Web browser fallback download
    downloadWavBlob(audio.blob, finalFilename);
    return { success: true, path: `Downloaded: ${finalFilename}` };
  }

  /**
   * Exports an entire sample pack of WAVs sequentially.
   */
  async exportSamplePack(presetId: string): Promise<string[]> {
    const pack = this.generateSamplePack(presetId);
    const results: string[] = [];

    for (const item of pack) {
      const res = await this.exportWav(item);
      if (res.path) results.push(res.path);
    }

    return results;
  }
}

export const psyGenerator = new PsyGeneratorEngine();
