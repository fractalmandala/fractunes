import type { AudioEngine } from "./engine";
import type { KBBBSequencer } from "./sequencer";

export class StemsExporter {
  engine: AudioEngine;
  sequencer: KBBBSequencer;

  constructor(engine: AudioEngine, sequencer: KBBBSequencer) {
    this.engine = engine;
    this.sequencer = sequencer;
  }

  audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const length = buffer.length;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, "WAVE");

    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    this.writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    const channels: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(buffer.getChannelData(c));
    }

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  downloadBlob(blob: Blob, filename: string) {
    if (typeof window === "undefined") return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async renderStem(trackFilter: number | null = null, bars = 2): Promise<Blob> {
    const sampleRate = 44100;
    const tempo = this.sequencer.tempo;
    const secondsPerBeat = 60.0 / tempo;
    const duration = secondsPerBeat * 4 * bars + 1.0;
    const totalFrames = Math.ceil(sampleRate * duration);

    const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);
    const eng = this.engine;
    const muted = eng?.muted || { kick: false, bass: false, lead: false, hats: false, master: false };
    const vols = eng?.volumes || { kick: 0.85, bass: 0.74, lead: 0.7, hats: 0.65, master: 0.8 };

    const g = (v: number, m: boolean) => (m ? 0 : v);
    const kickBus = offlineCtx.createGain();
    kickBus.gain.value = g(vols.kick, muted.kick);

    const bassBus = offlineCtx.createGain();
    bassBus.gain.value = g(vols.bass, muted.bass);

    const hatsBus = offlineCtx.createGain();
    hatsBus.gain.value = g(vols.hats, muted.hats);

    const leadBus = offlineCtx.createGain();
    leadBus.gain.value = g(vols.lead, muted.lead);

    const masterScale = offlineCtx.createGain();
    masterScale.gain.value = g(vols.master, muted.master);

    [kickBus, bassBus, hatsBus, leadBus].forEach((b) => b.connect(masterScale));
    masterScale.connect(offlineCtx.destination);

    let echoIn: GainNode | null = null;
    if (eng && eng.fx && eng.fx.delayNode) {
      const d = offlineCtx.createDelay(2.0);
      d.delayTime.value = eng.fx.delayNode.delayTime.value;
      const fb = offlineCtx.createGain();
      fb.gain.value = Math.min(0.6, eng.fx.feedbackGain.gain.value);
      const damp = offlineCtx.createBiquadFilter();
      damp.type = "lowpass";
      damp.frequency.value = eng.fx.delayFilter.frequency.value;
      const wet = offlineCtx.createGain();
      wet.gain.value = 0.3;
      echoIn = offlineCtx.createGain();
      echoIn.gain.value = 1.0;
      echoIn.connect(d);
      d.connect(damp);
      damp.connect(fb);
      fb.connect(d);
      d.connect(wet);
      wet.connect(leadBus);
    }

    const stepDuration = secondsPerBeat / 4.0;
    const totalSteps = 16 * bars;
    const swing = Math.max(0, Math.min(0.5, this.sequencer.swing || 0));

    for (let s = 0; s < totalSteps; s++) {
      const stepIdx = s % 16;
      let t = s * stepDuration + 0.01;
      if (stepIdx % 2 === 1) t += swing * stepDuration;

      // Track 0: Kick
      if ((trackFilter === null || trackFilter === 0) && this.sequencer.pattern[0][stepIdx]) {
        this.renderKick(offlineCtx, kickBus, t);
      }
      // Track 1: Bass
      if ((trackFilter === null || trackFilter === 1) && this.sequencer.pattern[1][stepIdx]) {
        this.renderBass(offlineCtx, bassBus, stepIdx, t);
      }
      // Hats: closed only on row2-without-row3
      if (
        (trackFilter === null || trackFilter === 2) &&
        this.sequencer.pattern[2][stepIdx] &&
        !this.sequencer.pattern[3][stepIdx]
      ) {
        this.renderHat(offlineCtx, hatsBus, false, t);
      }
      if ((trackFilter === null || trackFilter === 3) && this.sequencer.pattern[3][stepIdx]) {
        this.renderHat(offlineCtx, hatsBus, true, t);
      }
      // Track 4 / Master: Lead
      const hasGroove = this.sequencer.pattern[0][stepIdx] || this.sequencer.pattern[1][stepIdx];
      const isLeadStep = stepIdx % 2 === 1 || stepIdx === 2 || stepIdx === 10;
      if (
        (trackFilter === null || trackFilter === 4) &&
        this.sequencer.leadEnabled &&
        hasGroove &&
        isLeadStep
      ) {
        this.renderLead(offlineCtx, leadBus, echoIn, stepIdx, t);
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBytes = this.audioBufferToWav(renderedBuffer);
    return new Blob([wavBytes], { type: "audio/wav" });
  }

  renderKick(ctx: OfflineAudioContext, dest: AudioNode, t: number) {
    if (!this.engine.kick) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const curve = this.engine.kick.bezier.generateFrequencyCurve(32, 30);
    osc.frequency.setValueCurveAtTime(curve, t, this.engine.kick.pitchDecay);
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + this.engine.kick.volDecay);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + this.engine.kick.volDecay + 0.01);

    if (this.engine.kick.clickAmount > 0) {
      const sr = ctx.sampleRate;
      const frames = Math.max(16, Math.floor(sr * 0.003));
      const buf = ctx.createBuffer(1, frames, sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < frames; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (frames * 0.22));
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3800;
      const cg = ctx.createGain();
      cg.gain.value = this.engine.kick.clickAmount * 0.55;
      src.connect(hp);
      hp.connect(cg);
      cg.connect(dest);
      src.start(t);
    }
  }

  renderBass(ctx: OfflineAudioContext, dest: AudioNode, step: number, t: number) {
    if (!this.engine.synth || !this.engine.kick) return;
    const vel = step % 4 === 1 ? 0.62 : 0.92;
    const synth = this.engine.synth;
    const pitchSemi = synth.filterPitch || 0;
    let freq = this.engine.kick.rootPitch * 2 * Math.pow(2, pitchSemi / 12);
    if (synth.bassOctave && step === 14) freq *= 2;
    const decaySec = Math.max(0.02, Math.min(0.25, (synth.filterDecay || 90) / 1000));
    const osc = ctx.createOscillator();
    osc.type = typeof synth.oscTypeForTable === "function" ? synth.oscTypeForTable() : "sawtooth";
    osc.frequency.setValueAtTime(freq, t);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(synth.cutoff, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.075);
    filter.Q.value = synth.resonance;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decaySec);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + decaySec + 0.02);
  }

  renderHat(ctx: OfflineAudioContext, dest: AudioNode, isOpen: boolean, t: number) {
    if (!this.engine.hats) return;
    const decay = isOpen ? this.engine.hats.openDecay : this.engine.hats.closedDecay;
    const cluster = ctx.createGain();
    cluster.gain.value = 0.22;
    this.engine.hats.inharmonicFreqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(f * 2.8, t);
      osc.connect(cluster);
      osc.start(t);
      osc.stop(t + decay + 0.01);
    });

    const sr = ctx.sampleRate;
    const nFrames = Math.max(16, Math.floor(sr * decay));
    const nBuf = ctx.createBuffer(1, nFrames, sr);
    const nd = nBuf.getChannelData(0);
    for (let i = 0; i < nFrames; i++) nd[i] = Math.random() * 2 - 1;
    const nSrc = ctx.createBufferSource();
    nSrc.buffer = nBuf;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.35;
    nSrc.connect(nGain);
    nGain.connect(cluster);
    try {
      nSrc.start(t);
    } catch (e) {
      // ignore
    }
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(this.engine.hats.cutoff, t);
    hp.Q.setValueAtTime(this.engine.hats.resonance, t);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.75, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    cluster.connect(hp);
    hp.connect(env);
    env.connect(dest);
  }

  renderLead(
    ctx: OfflineAudioContext,
    dest: AudioNode,
    echoIn: GainNode | null,
    step: number,
    t: number
  ) {
    if (!this.engine.synth) return;
    const synth = this.engine.synth;
    const scale = synth.leadScale || [220, 261.6, 293.7];
    const noteIdx = (step * 2 + Math.floor(step / 4)) % scale.length;
    const octMult = Math.pow(2, Math.max(-1, Math.min(1, synth.leadOctave || 0)));
    const freq = scale[noteIdx] * 2 * octMult;
    const gate = Math.max(0.5, Math.min(1.5, synth.leadGate || 1));
    const toneOffset = (synth.filterTone || 0) * 40;
    const wet = Math.max(0, Math.min(1, synth.filterWet == null ? 1 : synth.filterWet));
    const voices = Math.max(1, Math.min(7, Math.round(synth.unisonVoices || 5)));
    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(0.18, t);
    vGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18 * gate);
    const flt = ctx.createBiquadFilter();
    flt.type = "lowpass";
    flt.frequency.setValueAtTime(Math.min(18000, synth.cutoff * 1.4 + toneOffset), t);
    flt.frequency.exponentialRampToValueAtTime(1200, t + 0.16);
    flt.Q.value = 2.5;
    for (let i = 0; i < voices; i++) {
      const o = ctx.createOscillator();
      o.type =
        typeof synth.oscTypeForTable === "function" && synth.activeTable === "acid_303"
          ? "square"
          : "sawtooth";
      o.detune.value = (synth.detune || 0) * (i - (voices - 1) / 2);
      o.frequency.setValueAtTime(freq, t);
      o.connect(flt);
      o.start(t);
      o.stop(t + 0.19 * gate);
    }
    flt.connect(vGain);
    vGain.connect(dest);
    if (echoIn && wet > 0.001) {
      const send = ctx.createGain();
      send.gain.value = wet;
      vGain.connect(send);
      send.connect(echoIn);
    }
  }

  async exportMasterTake(bars = 4) {
    const blob = await this.renderStem(null, bars);
    this.downloadBlob(blob, `PsyFracta_Master_Take_${this.sequencer.tempo}BPM.wav`);
  }

  async exportAllStems(bars = 4) {
    const names = ["Kick", "Bass", "Hats_Closed", "Hats_Open", "Lead"];
    for (let i = 0; i < 5; i++) {
      const blob = await this.renderStem(i, bars);
      this.downloadBlob(blob, `PsyFracta_Stem_${names[i]}_${this.sequencer.tempo}BPM.wav`);
    }
  }
}
