export class FxChain {
  ctx: AudioContext | OfflineAudioContext;
  destination: AudioNode;

  delayNode!: DelayNode;
  feedbackGain!: GainNode;
  delayFilter!: BiquadFilterNode;
  delayWet!: GainNode;

  reverbNode!: GainNode;
  reverbDecay = 2.2;
  reverbSize = 65;
  reverbWet!: GainNode;
  combGains: { gainNode: GainNode; delayTime: number }[] = [];

  constructor(ctx: AudioContext | OfflineAudioContext, destination: AudioNode) {
    this.ctx = ctx;
    this.destination = destination;

    // 1. PING-PONG STEREO DELAY
    this.delayNode = ctx.createDelay(2.0);
    this.delayNode.delayTime.value = 0.258;
    this.feedbackGain = ctx.createGain();
    this.feedbackGain.gain.value = 0.42;
    this.delayFilter = ctx.createBiquadFilter();
    this.delayFilter.type = "lowpass";
    this.delayFilter.frequency.value = 3200;
    this.delayFilter.Q.value = -3; // Safe loop stability

    this.delayNode.connect(this.delayFilter);
    this.delayFilter.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);

    this.delayWet = ctx.createGain();
    this.delayWet.gain.value = 0.3;
    this.delayNode.connect(this.delayWet);
    this.delayWet.connect(destination);

    // 2. LUSH PSYTRANCE REVERB (Schroeder Network)
    this.reverbNode = ctx.createGain();
    this.reverbNode.gain.value = 1.0;

    this.reverbDecay = 2.2;
    this.reverbWet = ctx.createGain();
    this.reverbWet.gain.value = 0.3;

    // 4 Parallel Comb Filters
    const combDelays = [0.0297, 0.0371, 0.0411, 0.0437];
    const combSum = ctx.createGain();
    combSum.gain.value = 0.25;

    combDelays.forEach((d) => {
      const delay = ctx.createDelay(0.1);
      delay.delayTime.value = d;
      const fb = ctx.createGain();
      fb.gain.value = this.combFeedback(d);
      this.combGains.push({ gainNode: fb, delayTime: d });

      const damp = ctx.createBiquadFilter();
      damp.type = "lowpass";
      damp.frequency.value = 4500;
      damp.Q.value = -3;

      this.reverbNode.connect(delay);
      delay.connect(damp);
      damp.connect(fb);
      fb.connect(delay);
      damp.connect(combSum);
    });

    // 2 Series Allpass Filters for Diffusion
    this.reverbSize = 65;
    const apDelays = [0.005, 0.0017];
    let lastNode: AudioNode = combSum;
    apDelays.forEach((d) => {
      const g = 0.6;
      const apIn = ctx.createGain();
      const apDelay = ctx.createDelay(0.03);
      apDelay.delayTime.value = d;
      const apFb = ctx.createGain();
      apFb.gain.value = g;
      const apFf = ctx.createGain();
      apFf.gain.value = -g;
      const apOut = ctx.createGain();

      lastNode.connect(apIn);
      apIn.connect(apDelay);
      apDelay.connect(apFb);
      apFb.connect(apDelay);
      apIn.connect(apFf);
      apFf.connect(apOut);
      apDelay.connect(apOut);
      lastNode = apOut;
    });

    lastNode.connect(this.reverbWet);
    this.reverbWet.connect(destination);
  }

  setDelayTime(sec: number) {
    if (this.delayNode) {
      this.delayNode.delayTime.setTargetAtTime(
        Math.max(0.01, Math.min(1.5, sec)),
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setDelayFeedback(amt: number) {
    if (this.feedbackGain) {
      this.feedbackGain.gain.setTargetAtTime(
        Math.max(0, Math.min(0.9, amt)),
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setDelayFilter(hz: number) {
    if (this.delayFilter) {
      this.delayFilter.frequency.setTargetAtTime(
        Math.max(200, Math.min(16000, hz)),
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setReverbDecay(sec: number) {
    this.reverbDecay = Math.max(0.2, Math.min(8.0, sec));
    this.combGains.forEach(({ gainNode, delayTime }) => {
      const fb = this.combFeedback(delayTime);
      gainNode.gain.setTargetAtTime(fb, this.ctx.currentTime, 0.03);
    });
  }

  combFeedback(delayTime: number): number {
    const target = Math.exp((-3 * delayTime) / this.reverbDecay);
    return Math.min(0.85, target);
  }

  setReverbWet(amt: number) {
    if (this.reverbWet) {
      this.reverbWet.gain.setTargetAtTime(
        Math.max(0, Math.min(1.0, amt)),
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setReverbSize(size: number) {
    this.reverbSize = Math.max(10, Math.min(100, size));
    const decay = 0.6 + (this.reverbSize / 100) * 4.4;
    this.setReverbDecay(decay);
  }
}
