import { invoke, isTauri } from "@tauri-apps/api/core";

export interface MidiDevice {
  id: number;
  name: string;
}

export interface AudioSystemInfo {
  platform: string;
  sample_rate: number;
  bit_depth: number;
  channels: number;
}

export interface ExportResult {
  success: boolean;
  path: string;
  file_size_bytes: number;
}

export async function listMidiInputs(): Promise<MidiDevice[]> {
  if (isTauri()) {
    try {
      return await invoke<MidiDevice[]>("list_midi_inputs");
    } catch (e) {
      console.warn("Tauri list_midi_inputs error:", e);
      return [];
    }
  }
  return [];
}

export async function getAudioSystemInfo(): Promise<AudioSystemInfo | null> {
  if (isTauri()) {
    try {
      return await invoke<AudioSystemInfo>("get_audio_system_info");
    } catch (e) {
      console.warn("Tauri get_audio_system_info error:", e);
      return null;
    }
  }
  return null;
}

export async function exportWavNative(
  filename: string,
  samples: Float32Array,
  sampleRate = 44100,
  channels = 2
): Promise<ExportResult | null> {
  if (isTauri()) {
    try {
      return await invoke<ExportResult>("export_wav_file", {
        filename,
        samples: Array.from(samples),
        sampleRate,
        channels
      });
    } catch (e) {
      console.error("Native export WAV error:", e);
      return null;
    }
  }
  return null;
}

export async function saveUserPresetNative(name: string, presetJson: string): Promise<string | null> {
  if (isTauri()) {
    try {
      return await invoke<string>("save_user_preset", {
        name,
        presetJson
      });
    } catch (e) {
      console.error("Native save preset error:", e);
      return null;
    }
  }
  return null;
}
