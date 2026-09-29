import { AudioEngine } from "../audio/engine";
import { KBBBSequencer } from "../audio/sequencer";
import { ModulatorEngine } from "../audio/modulators";
import { SOUNDBANK, type SoundbankPreset } from "../audio/presets";

export class SynthStore {
  engine: AudioEngine;
  sequencer: KBBBSequencer;
  modulators: ModulatorEngine | null = null;

  isPlaying = $state(false);
  currentStep = $state(-1);
  tempo = $state(145);
  selectedPresetIdx = $state(0);
  keyLabel = $state("F# Minor");
  subgenreLabel = $state("Israeli Morning Full-On · 16th Gal-Op");
  timecode = $state("00:00.0");

  // Track volumes & mutes
  volumes = $state({
    kick: 0.85,
    bass: 0.74,
    lead: 0.7,
    hats: 0.65,
    master: 0.8
  });

  muted = $state({
    kick: false,
    bass: false,
    lead: false,
    hats: false,
    master: false
  });

  pan = $state(0);
  leadEnabled = $state(true);
  swing = $state(0);
  activeSlot = $state<"A" | "B">("A");
  bassOctave = $state(false);
  leadOctave = $state(0);
  fillArmed = $state(false);

  // Kick params
  kickPitch = $state(46.2);
  kickPitchDec = $state(72);
  kickVolDec = $state(125);
  kickPunch = $state(52);

  // Hats params
  hatCutoff = $state(8.8);
  hatRes = $state(2.6);
  hatClDec = $state(22);
  hatOpDec = $state(155);

  // Wavetable synth params
  synthTable = $state("supersaw");
  synthWarpMode = $state("bend");
  synthWarpAmt = $state(38);
  synthUnison = $state(7);
  synthCutoff = $state(3.6);

  // Filter strip params
  filterCutoff = $state(3.6);
  filterRes = $state(3.4);
  filterDecay = $state(90);
  filterPitch = $state(0);
  filterSlope = $state("24dB");
  filterTone = $state(0);
  filterScale = $state("Chr");
  filterWet = $state(100);

  // FX params
  delayTime = $state(258);
  delayFeedback = $state(42);
  delayFilter = $state(3.2);

  reverbSize = $state(65);
  reverbDecay = $state(2.2);
  reverbWet = $state(30);

  // Modulator params
  modAWave = $state("sine");
  modARate = $state(0.5);
  modAAmt = $state(40);

  modBWave = $state("fold");
  modBRate = $state(0.25);
  modBAmt = $state(60);

  // Sequencer pattern matrix
  pattern = $state<number[][]>([
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
  ]);

  private startTime = 0;
  private timecodeTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.engine = new AudioEngine();
    this.sequencer = new KBBBSequencer(this.engine);
    this.engine.initExporter(this.sequencer);

    if (typeof window !== "undefined") {
      this.modulators = new ModulatorEngine(this.engine);
    }

    this.sequencer.onStepChange = (step: number) => {
      this.currentStep = step;
      if (this.fillArmed && step === 15) {
        this.fillArmed = false;
      }
    };
  }

  ensureAudio() {
    this.engine.ensure();
  }

  togglePlay(): boolean {
    this.ensureAudio();
    const playing = this.sequencer.toggle();
    this.isPlaying = playing;
    if (playing) {
      this.startTime = performance.now();
      this.timecodeTimer = setInterval(() => this.updateTimecode(), 80);
    } else {
      if (this.timecodeTimer) clearInterval(this.timecodeTimer);
      this.timecodeTimer = null;
      this.currentStep = -1;
    }
    return playing;
  }

  private updateTimecode() {
    if (!this.isPlaying) return;
    const elapsed = (performance.now() - this.startTime) / 1000;
    const mins = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const secs = (elapsed % 60).toFixed(1).padStart(4, "0");
    this.timecode = `${mins}:${secs}`;
  }

  loadPresetByIdx(idx: number) {
    if (idx < 0 || idx >= SOUNDBANK.length) return;
    const p = SOUNDBANK[idx];
    this.selectedPresetIdx = idx;
    this.tempo = p.tempo;
    this.keyLabel = p.key;

    this.sequencer.loadPreset(p);
    this.pattern = this.sequencer.pattern.map((r) => [...r]);

    this.kickPitch = p.kick.rootPitch;
    this.kickPunch = p.kick.punch;
    this.kickPitchDec = Math.round(p.kick.pitchDecay * 1000);
    this.kickVolDec = Math.round(p.kick.volDecay * 1000);

    this.hatCutoff = p.hats.cutoff / 1000;
    this.hatRes = p.hats.resonance;
    this.hatClDec = Math.round(p.hats.closedDecay * 1000);
    this.hatOpDec = Math.round(p.hats.openDecay * 1000);

    this.synthTable = p.synth.table;
    this.synthWarpMode = p.synth.warpMode;
    this.synthWarpAmt = Math.round(p.synth.warpAmount * 100);
    this.synthUnison = p.synth.unison;
    this.synthCutoff = p.synth.cutoff / 1000;
    this.filterCutoff = p.synth.cutoff / 1000;
    this.filterRes = p.synth.resonance;

    this.delayTime = Math.round(p.fx.delayTime * 1000);
    this.delayFeedback = Math.round(p.fx.feedback * 100);
    this.delayFilter = p.fx.delayFilter / 1000;
    this.reverbDecay = p.fx.reverbDecay;
    this.reverbWet = Math.round(p.fx.reverbWet * 100);
  }

  setVolume(track: "kick" | "bass" | "lead" | "hats" | "master", val: number) {
    this.volumes[track] = val;
    this.engine.setTrackVolume(track, val);
  }

  toggleMute(track: "kick" | "bass" | "lead" | "hats" | "master"): boolean {
    const isMuted = this.engine.toggleMute(track);
    this.muted[track] = isMuted;
    return isMuted;
  }

  toggleStep(track: number, step: number) {
    this.ensureAudio();
    const val = this.sequencer.toggleStep(track, step);
    this.pattern[track][step] = val;
  }

  resetPattern() {
    this.sequencer.resetKbbb();
    this.pattern = this.sequencer.pattern.map((r) => [...r]);
  }

  clearPattern() {
    this.sequencer.clear();
    this.pattern = this.sequencer.pattern.map((r) => [...r]);
  }

  toggleSlot() {
    if (this.activeSlot === "A") {
      this.sequencer.saveSlot("A");
      if (!this.sequencer.loadSlot("B")) {
        this.sequencer.saveSlot("B");
      }
      this.activeSlot = "B";
    } else {
      this.sequencer.saveSlot("B");
      this.sequencer.loadSlot("A");
      this.activeSlot = "A";
    }
    this.pattern = this.sequencer.pattern.map((r) => [...r]);
  }

  armFill() {
    this.sequencer.armFill();
    this.fillArmed = true;
  }

  toggleBassOctave() {
    this.bassOctave = !this.bassOctave;
    if (this.engine.synth) this.engine.synth.bassOctave = this.bassOctave;
  }

  cycleLeadOctave() {
    const next = this.leadOctave === 1 ? -1 : this.leadOctave + 1;
    this.leadOctave = next;
    if (this.engine.synth) this.engine.synth.leadOctave = next;
  }

  toggleLead() {
    this.leadEnabled = !this.leadEnabled;
    this.sequencer.leadEnabled = this.leadEnabled;
    if (this.engine.synth) this.engine.synth.leadEnabled = this.leadEnabled;
  }

  setSwing(val: number) {
    this.swing = val;
    this.sequencer.setSwing(val);
  }
}

export const synthStore = new SynthStore();
