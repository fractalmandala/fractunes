export class MetallicHatEngine {
  ctx: AudioContext | OfflineAudioContext;
  destination: AudioNode;
  inharmonicFreqs: number[];
  cutoff: number;
  resonance: number;
  closedDecay: number;
  openDecay: number;
  activeOpenVoice: GainNode | null;

  constructor(ctx: AudioContext | OfflineAudioContext, destination: AudioNode) {
    this.ctx = ctx;
    this.destination = destination;
    this.inharmonicFreqs = [300, 460, 620, 810, 1050, 1420];
    this.cutoff = 8200;
    this.resonance = 2.2;
    this.closedDecay = 0.026;
    this.openDecay = 0.15;
    this.activeOpenVoice = null;
  }

  trigger(isOpen = false, time = 0) {
    const t = time || this.ctx.currentTime;
    const decay = isOpen ? this.openDecay : this.closedDecay;

    if (!isOpen && this.activeOpenVoice) {
      try {
        this.activeOpenVoice.gain.cancelScheduledValues(t);
        this.activeOpenVoice.gain.setValueAtTime(this.activeOpenVoice.gain.value, t);
        this.activeOpenVoice.gain.exponentialRampToValueAtTime(0.0001, t + 0.005);
      } catch (e) {
        // ignore
      }
      this.activeOpenVoice = null;
    }

    const clusterGain = this.ctx.createGain();
    clusterGain.gain.value = 0.22;

    this.inharmonicFreqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(f * 2.8, t);
      osc.connect(clusterGain);
      osc.start(t);
      osc.stop(t + decay + 0.01);
    });

    const noiseFrames = Math.floor(this.ctx.sampleRate * decay);
    const noiseBuf = this.ctx.createBuffer(1, Math.max(16, noiseFrames), this.ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseBuf.length; i++) nd[i] = Math.random() * 2 - 1;

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.35;
    noiseSrc.connect(noiseGain);
    noiseGain.connect(clusterGain);
    noiseSrc.start(t);

    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(this.cutoff, t);
    hp.Q.setValueAtTime(this.resonance, t);

    const envGain = this.ctx.createGain();
    envGain.gain.setValueAtTime(0.75, t);
    envGain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    clusterGain.connect(hp);
    hp.connect(envGain);
    envGain.connect(this.destination);

    if (isOpen) {
      this.activeOpenVoice = envGain;
    }
  }
}
