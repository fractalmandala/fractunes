import { CubicBezier } from "./bezier";

export class PsyKickEngine {
  ctx: AudioContext | OfflineAudioContext;
  destination: AudioNode;
  bezier: CubicBezier;
  rootPitch: number;
  pitchDecay: number;
  volDecay: number;
  punch: number;
  clickAmount: number;

  constructor(ctx: AudioContext | OfflineAudioContext, destination: AudioNode) {
    this.ctx = ctx;
    this.destination = destination;
    this.bezier = new CubicBezier(7500, 1100, 120, 55);
    this.rootPitch = 55;
    this.pitchDecay = 0.08;
    this.volDecay = 0.14;
    this.punch = 45;
    this.clickAmount = 0.7;
  }

  setTuning(hz: number) {
    this.rootPitch = hz;
    this.bezier.p3 = hz;
  }

  setPunch(pct: number) {
    this.punch = pct;
    this.bezier.c1y = 500 + pct * 20;
  }

  trigger(time = 0) {
    const t = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const curve = this.bezier.generateFrequencyCurve(32, 30);
    osc.frequency.setValueCurveAtTime(curve, t, this.pitchDecay);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + this.volDecay);

    osc.connect(gain);
    gain.connect(this.destination);
    osc.start(t);
    osc.stop(t + this.volDecay + 0.01);

    if (this.clickAmount > 0) {
      const clickFrames = Math.floor(this.ctx.sampleRate * 0.003);
      const clickBuf = this.ctx.createBuffer(1, clickFrames, this.ctx.sampleRate);
      const d = clickBuf.getChannelData(0);
      for (let i = 0; i < clickFrames; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickFrames * 0.22));
      }
      const clickSrc = this.ctx.createBufferSource();
      clickSrc.buffer = clickBuf;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = "highpass";
      clickFilter.frequency.value = 3800;

      const clickGain = this.ctx.createGain();
      clickGain.gain.value = this.clickAmount * 0.55;

      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.destination);
      clickSrc.start(t);
    }
  }
}
