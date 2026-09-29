import { PsyKickEngine } from "./kick-engine";
import { MetallicHatEngine } from "./hat-engine";
import { SynthEngine } from "./synth-engine";
import { FxChain } from "./fx-chain";
import { StemsExporter } from "./stems-exporter";
import type { KBBBSequencer } from "./sequencer";

export class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  comp: DynamicsCompressorNode | null = null;
  panner: StereoPannerNode | null = null;
  analyser: AnalyserNode | null = null;
  fx: FxChain | null = null;
  kick: PsyKickEngine | null = null;
  hats: MetallicHatEngine | null = null;
  synth: SynthEngine | null = null;
  exporter: StemsExporter | null = null;

  kickGain: GainNode | null = null;
  bassGain: GainNode | null = null;
  leadGain: GainNode | null = null;
  hatsGain: GainNode | null = null;

  muted = { kick: false, bass: false, lead: false, hats: false, master: false };
  volumes = { kick: 0.85, bass: 0.74, lead: 0.7, hats: 0.65, master: 0.8 };

  ensure() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volumes.master;

      this.comp = this.ctx.createDynamicsCompressor();
      this.comp.threshold.value = -14;
      this.comp.knee.value = 20;
      this.comp.ratio.value = 3.5;
      this.comp.attack.value = 0.004;
      this.comp.release.value = 0.18;
      this.masterGain.connect(this.comp);

      if (this.ctx.createStereoPanner) {
        this.panner = this.ctx.createStereoPanner();
        this.panner.pan.value = 0;
        this.comp.connect(this.panner);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.panner.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } else {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.comp.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      this.kickGain = this.ctx.createGain();
      this.kickGain.gain.value = this.volumes.kick;
      this.kickGain.connect(this.masterGain);

      this.bassGain = this.ctx.createGain();
      this.bassGain.gain.value = this.volumes.bass;
      this.bassGain.connect(this.masterGain);

      this.leadGain = this.ctx.createGain();
      this.leadGain.gain.value = this.volumes.lead;
      this.leadGain.connect(this.masterGain);

      this.hatsGain = this.ctx.createGain();
      this.hatsGain.gain.value = this.volumes.hats;
      this.hatsGain.connect(this.masterGain);

      this.fx = new FxChain(this.ctx, this.leadGain);
      this.kick = new PsyKickEngine(this.ctx, this.kickGain);
      this.hats = new MetallicHatEngine(this.ctx, this.hatsGain);
      this.synth = new SynthEngine(this.ctx, this.bassGain, this.leadGain, this.fx);
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setTrackVolume(track: "kick" | "bass" | "lead" | "hats" | "master", val: number) {
    this.ensure();
    if (!this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.volumes[track] = clamped;
    const effective = this.muted[track] ? 0 : clamped;

    if (track === "kick" && this.kickGain)
      this.kickGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.01);
    if (track === "bass" && this.bassGain)
      this.bassGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.01);
    if (track === "lead" && this.leadGain)
      this.leadGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.01);
    if (track === "hats" && this.hatsGain)
      this.hatsGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.01);
    if (track === "master" && this.masterGain)
      this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.01);
  }

  setPan(val: number) {
    this.ensure();
    if (this.panner && this.ctx) {
      this.panner.pan.setTargetAtTime(Math.max(-1, Math.min(1, val)), this.ctx.currentTime, 0.02);
    }
  }

  toggleMute(track: "kick" | "bass" | "lead" | "hats" | "master"): boolean {
    this.ensure();
    this.muted[track] = !this.muted[track];
    this.setTrackVolume(track, this.volumes[track]);
    return this.muted[track];
  }

  initExporter(sequencer: KBBBSequencer) {
    this.exporter = new StemsExporter(this, sequencer);
  }
}
