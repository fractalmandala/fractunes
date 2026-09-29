import type { AudioEngine } from "./engine";
import type { SoundbankPreset } from "./presets";

export class KBBBSequencer {
  engine: AudioEngine;
  tempo = 145;
  isPlaying = false;
  currentStep = 0;
  timerId: ReturnType<typeof setInterval> | null = null;
  onStepChange: ((step: number) => void) | null = null;

  swing = 0;
  nextNoteTime = 0;
  lookahead = 0.12;
  tickInterval = 25;

  pattern: number[][] = [
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], // 0: Kick
    [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1], // 1: Rolling Bass
    [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1], // 2: Hat Closed
    [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]  // 3: Hat Open
  ];

  leadEnabled = true;
  slotA: number[][] | null = null;
  slotB: number[][] | null = null;
  activeSlot = "A";
  fillArmed = false;
  activePreset: SoundbankPreset | null = null;

  constructor(audioEngine: AudioEngine) {
    this.engine = audioEngine;
  }

  stepDur(): number {
    return 60.0 / this.tempo / 4.0;
  }

  start() {
    this.engine.ensure();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = (this.engine.ctx?.currentTime || 0) + 0.06;
    this.timerId = setInterval(() => this.scheduler(), this.tickInterval);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
    if (this.onStepChange) this.onStepChange(-1);
  }

  toggle(): boolean {
    if (this.isPlaying) this.stop();
    else this.start();
    return this.isPlaying;
  }

  setSwing(pct: number) {
    this.swing = Math.max(0, Math.min(0.5, pct));
  }

  scheduler() {
    if (!this.isPlaying || !this.engine.ctx) return;
    while (this.nextNoteTime < this.engine.ctx.currentTime + this.lookahead) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      const stepDur = this.stepDur();
      this.nextNoteTime += stepDur;
      this.currentStep = (this.currentStep + 1) % 16;
    }
  }

  scheduleStep(step: number, time: number) {
    let t = time;
    if (step % 2 === 1) t += this.swing * this.stepDur();

    let pat = this.pattern;
    if (this.fillArmed) {
      pat = [
        [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        this.pattern[1],
        [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,1]
      ];
      if (step === 15) this.fillArmed = false;
    }

    if (this.onStepChange && this.engine.ctx) {
      const delayMs = Math.max(0, (t - this.engine.ctx.currentTime) * 1000);
      const s = step;
      setTimeout(() => {
        if (this.isPlaying && this.onStepChange) this.onStepChange(s);
      }, delayMs);
    }

    // 1. Kick Trigger
    if (pat[0][step] && this.engine.kick) {
      this.engine.kick.trigger(t);
    }

    // 2. Rolling Bass Trigger
    if (pat[1][step] && this.engine.synth && this.engine.kick) {
      this.engine.synth.triggerRollingBass(step, this.engine.kick.rootPitch, t);
    }

    // 3. Melodic Morning Lead Arp
    const hasGroove = pat[0][step] || pat[1][step];
    if (this.leadEnabled && hasGroove && (step % 2 === 1 || step === 2 || step === 10)) {
      if (this.engine.synth) this.engine.synth.triggerMelodicLead(step, t);
    }

    // 4. Hats
    if (pat[3][step] && this.engine.hats) {
      this.engine.hats.trigger(true, t);
    } else if (pat[2][step] && this.engine.hats) {
      this.engine.hats.trigger(false, t);
    }
  }

  toggleStep(track: number, step: number): number {
    this.pattern[track][step] = this.pattern[track][step] ? 0 : 1;
    return this.pattern[track][step];
  }

  loadPreset(p: SoundbankPreset) {
    this.engine.ensure();
    this.tempo = p.tempo;
    this.activePreset = p;
    this.pattern = p.pattern.map((row) => [...row]);

    if (this.engine.kick) {
      this.engine.kick.setTuning(p.kick.rootPitch);
      this.engine.kick.setPunch(p.kick.punch);
      this.engine.kick.clickAmount = p.kick.clickAmount;
      this.engine.kick.pitchDecay = p.kick.pitchDecay;
      this.engine.kick.volDecay = p.kick.volDecay;
      this.engine.kick.bezier.p0 = p.kick.p0;
      this.engine.kick.bezier.c1y = 500 + p.kick.punch * 20;
      this.engine.kick.bezier.c2y = p.kick.c2y;
      this.engine.kick.bezier.p3 = p.kick.rootPitch;
    }
    if (this.engine.hats) {
      this.engine.hats.cutoff = p.hats.cutoff;
      this.engine.hats.resonance = p.hats.resonance;
      this.engine.hats.closedDecay = p.hats.closedDecay;
      this.engine.hats.openDecay = p.hats.openDecay;
    }
    if (this.engine.synth) {
      this.engine.synth.activeTable = p.synth.table;
      this.engine.synth.warpMode = p.synth.warpMode;
      this.engine.synth.warpAmount = p.synth.warpAmount;
      this.engine.synth.unisonVoices = p.synth.unison;
      this.engine.synth.detune = p.synth.detune;
      this.engine.synth.cutoff = p.synth.cutoff;
      this.engine.synth.resonance = p.synth.resonance;
      if (p.leadArp) {
        this.engine.synth.leadScale = p.leadArp.noteScale;
      }
    }
    if (this.engine.fx) {
      this.engine.fx.delayNode.delayTime.value = p.fx.delayTime;
      this.engine.fx.feedbackGain.gain.value = p.fx.feedback;
      if (p.fx.delayFilter) this.engine.fx.delayFilter.frequency.value = p.fx.delayFilter;
      this.engine.fx.setReverbDecay(p.fx.reverbDecay);
      this.engine.fx.reverbWet.gain.value = p.fx.reverbWet;
    }
  }

  resetKbbb() {
    this.pattern[0] = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0];
    this.pattern[1] = [0,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1];
    this.pattern[2] = [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1];
    this.pattern[3] = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0];
  }

  clear() {
    for (let t = 0; t < 4; t++) this.pattern[t].fill(0);
  }

  saveSlot(which: "A" | "B") {
    const copy = this.pattern.map((r) => [...r]);
    if (which === "A") this.slotA = copy;
    else this.slotB = copy;
    this.activeSlot = which;
  }

  loadSlot(which: "A" | "B"): boolean {
    const src = which === "A" ? this.slotA : this.slotB;
    if (src) {
      this.pattern = src.map((r) => [...r]);
      this.activeSlot = which;
      return true;
    }
    return false;
  }

  armFill() {
    this.fillArmed = true;
  }
}
