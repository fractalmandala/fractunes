import { WavetableEngine } from "./wavetable";
import type { FxChain } from "./fx-chain";

export class SynthEngine {
  ctx: AudioContext | OfflineAudioContext;
  bassDestination: AudioNode;
  leadDestination: AudioNode;
  fxChain: FxChain | null;
  wavetable: WavetableEngine;

  activeTable = "supersaw";
  warpMode = "bend";
  warpAmount = 0.38;
  unisonVoices = 7;
  detune = 26; // cents
  cutoff = 3600;
  resonance = 3.4;

  filterDecay = 90; // ms
  filterPitch = 0; // semitones
  filterTone = 0; // -50..+50
  filterWet = 1.0; // 0..1
  filterSlope = "24dB";
  filterScale = "Chr";

  modAOffset = 0;
  modBOffset = 0;

  bassOctave = false;
  leadOctave = 0;
  leadGate = 1.0;

  leadScale: number[] = [185, 220, 246.9, 277.2, 329.6, 370];
  leadEnabled = true;
  leadStepIdx = 0;

  constructor(
    ctx: AudioContext | OfflineAudioContext,
    bassDestination: AudioNode,
    leadDestination: AudioNode,
    fxChain: FxChain | null = null
  ) {
    this.ctx = ctx;
    this.bassDestination = bassDestination;
    this.leadDestination = leadDestination;
    this.fxChain = fxChain;
    this.wavetable = new WavetableEngine();
  }

  oscTypeForTable(): OscillatorType {
    switch (this.activeTable) {
      case "acid_303":
        return "square";
      case "fm_squelch":
        return "triangle";
      case "formant":
        return "triangle";
      case "spectral_bell":
        return "sine";
      case "rolling":
      case "distorted_saw":
      default:
        return "sawtooth";
    }
  }

  triggerRollingBass(step: number, rootFreq = 50, time = 0) {
    const t = time || this.ctx.currentTime;
    const vel = step % 4 === 1 ? 0.62 : 0.92;
    let baseFreq = rootFreq * 2 * Math.pow(2, (this.filterPitch || 0) / 12);
    if (this.bassOctave && step === 14) baseFreq *= 2;
    const decaySec = Math.max(0.02, Math.min(0.25, (this.filterDecay || 40) / 1000));
    const cutoffNow = Math.max(200, Math.min(18000, this.cutoff + (this.modAOffset || 0)));

    const osc = this.ctx.createOscillator();
    osc.type = this.oscTypeForTable();
    const warpDet = (this.warpAmount || 0) * 12 + (this.modBOffset || 0) * 40;
    try {
      osc.detune.setValueAtTime(warpDet, t);
    } catch (e) {
      // ignore
    }
    osc.frequency.setValueAtTime(baseFreq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoffNow, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.075);
    filter.Q.value = this.resonance;

    let lastNode: AudioNode = filter;
    if (this.filterSlope === "24dB") {
      const f2 = this.ctx.createBiquadFilter();
      f2.type = "lowpass";
      f2.frequency.setValueAtTime(cutoffNow, t);
      f2.frequency.exponentialRampToValueAtTime(320, t + 0.075);
      f2.Q.value = this.resonance * 0.7;
      filter.connect(f2);
      lastNode = f2;
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decaySec);

    osc.connect(filter);
    lastNode.connect(gain);
    gain.connect(this.bassDestination);

    osc.start(t);
    osc.stop(t + decaySec + 0.02);
  }

  triggerMelodicLead(step: number, time = 0) {
    if (!this.leadEnabled) return;
    const t = time || this.ctx.currentTime;

    const noteIdx = (step * 2 + Math.floor(step / 4)) % this.leadScale.length;
    const octMult = Math.pow(2, Math.max(-1, Math.min(1, this.leadOctave || 0)));
    const freq = this.leadScale[noteIdx] * 2 * octMult;
    const gate = Math.max(0.5, Math.min(1.5, this.leadGate || 1));

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.18, t);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18 * gate);

    const toneOffset = (this.filterTone || 0) * 40;
    const cutoffNow = Math.max(
      300,
      Math.min(18000, this.cutoff * 1.4 + toneOffset + (this.modAOffset || 0))
    );
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoffNow, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.16);
    filter.Q.value = 2.5;

    const voices = Math.max(1, Math.min(7, Math.round(this.unisonVoices)));
    const oscType = this.oscTypeForTable();
    for (let i = 0; i < voices; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = oscType;
      const detuneCents = this.detune * (i - (voices - 1) / 2);
      osc.detune.setValueAtTime(detuneCents, t);
      osc.frequency.setValueAtTime(freq, t);

      osc.connect(filter);
      osc.start(t);
      osc.stop(t + 0.19 * gate);
    }

    filter.connect(voiceGain);
    voiceGain.connect(this.leadDestination);

    const wet = Math.max(0, Math.min(1, this.filterWet == null ? 1 : this.filterWet));
    if (this.fxChain && wet > 0.001) {
      const sendGain = this.ctx.createGain();
      sendGain.gain.value = wet;
      voiceGain.connect(sendGain);
      if (this.fxChain.delayNode) sendGain.connect(this.fxChain.delayNode);
      if (this.fxChain.reverbNode) sendGain.connect(this.fxChain.reverbNode);
    }
  }

  triggerPad(freq = 220, dur = 1.2, time = 0) {
    const t = time || this.ctx.currentTime;
    const voices = Math.max(1, Math.min(7, Math.round(this.unisonVoices)));
    const detuneSpread = this.detune;
    const dest = this.leadDestination || this.bassDestination;

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.25 / Math.sqrt(voices), t);
    padGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.cutoff, t);
    filter.Q.value = 1.6;

    for (let i = 0; i < voices; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = this.oscTypeForTable();
      const detuneCents = detuneSpread * (i - (voices - 1) / 2);
      osc.detune.setValueAtTime(detuneCents, t);
      osc.frequency.setValueAtTime(freq, t);

      osc.connect(filter);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }

    filter.connect(padGain);
    if (dest) padGain.connect(dest);
    if (this.fxChain && this.fxChain.reverbNode) {
      padGain.connect(this.fxChain.reverbNode);
    }
  }
}
