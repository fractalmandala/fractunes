/**
 * 2048-Sample Single-Cycle Wavetable & Warp Engine (Serum Style)
 * Extended with dedicated Psytrance wavetables (Acid 303, FM Squelch, Supersaw, Formant, Bell)
 */
export class WavetableEngine {
  tableSize = 2048;
  tables: Record<string, Float32Array>;

  constructor() {
    this.tables = {
      supersaw: this.createSawTable(),
      acid_303: this.createAcidTable(),
      fm_squelch: this.createFmSquelchTable(),
      rolling: this.createRollingBassTable(),
      formant: this.createFormantTable(),
      spectral_bell: this.createBellTable(),
      distorted_saw: this.createDistortedSawTable()
    };
  }

  createSawTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      let sum = 0;
      for (let h = 1; h <= 32; h++) {
        sum += (1.0 / h) * Math.sin((h * 2 * Math.PI * i) / this.tableSize);
      }
      buf[i] = sum * (2 / Math.PI) * 0.7;
    }
    return buf;
  }

  createAcidTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      const p = (i / this.tableSize) * 2 - 1;
      buf[i] = Math.tanh(p * 2.8) * 0.85;
    }
    return buf;
  }

  createFmSquelchTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      const phase = (i / this.tableSize) * Math.PI * 2;
      const mod = Math.sin(phase * 3.5) * 1.8;
      buf[i] = Math.sin(phase + mod) * 0.75;
    }
    return buf;
  }

  createRollingBassTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      let sum = 0;
      for (let h = 1; h <= 16; h++) {
        const weight = h % 2 === 1 ? 1.0 / h : 0.35 / h;
        sum += weight * Math.sin((h * 2 * Math.PI * i) / this.tableSize);
      }
      buf[i] = sum * 0.7;
    }
    return buf;
  }

  createFormantTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      const phase = (i / this.tableSize) * Math.PI * 2;
      buf[i] = (Math.sin(phase) + 0.6 * Math.sin(3 * phase) + 0.35 * Math.sin(5 * phase)) * 0.7;
    }
    return buf;
  }

  createBellTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      const phase = (i / this.tableSize) * Math.PI * 2;
      buf[i] = (Math.sin(phase) + 0.5 * Math.sin(phase * 2.76) + 0.3 * Math.sin(phase * 5.4)) * 0.6;
    }
    return buf;
  }

  createDistortedSawTable(): Float32Array {
    const buf = new Float32Array(this.tableSize);
    for (let i = 0; i < this.tableSize; i++) {
      const p = i / this.tableSize;
      buf[i] = 2 * p - 1 + 0.3 * Math.sin(p * Math.PI * 4);
    }
    return buf;
  }

  warpPhase(phase: number, mode: string, amount: number): number {
    let p = phase % 1.0;
    if (p < 0) p += 1.0;
    if (mode === "bend" && amount !== 0) {
      return Math.pow(p, Math.pow(2, amount * 2.0));
    }
    if (mode === "sync") {
      const ratio = 1.0 + amount * 3.0;
      return (p * ratio) % 1.0;
    }
    if (mode === "pwm") {
      const pw = 0.5 + amount * 0.4;
      return p < pw ? 0.5 * (p / pw) : 0.5 + 0.5 * ((p - pw) / (1.0 - pw));
    }
    if (mode === "fm") {
      const mod = Math.sin(p * Math.PI * 4) * amount * 0.25;
      return (p + mod + 1.0) % 1.0;
    }
    return p;
  }

  lookup(tableKey: string, phase: number, warpMode = "none", warpAmount = 0): number {
    const table = this.tables[tableKey] || this.tables.supersaw;
    const warped = this.warpPhase(phase, warpMode, warpAmount);
    const index = (warped * this.tableSize) % this.tableSize;
    const i0 = Math.floor(index);
    const i1 = (i0 + 1) % this.tableSize;
    const frac = index - i0;
    return table[i0] * (1 - frac) + table[i1] * frac;
  }
}
