export class CubicBezier {
  p0: number;
  c1y: number;
  c2y: number;
  p3: number;

  constructor(p0 = 7500, c1y = 1100, c2y = 120, p3 = 55) {
    this.p0 = p0;
    this.c1y = c1y;
    this.c2y = c2y;
    this.p3 = p3;
  }

  evaluate(t: number): number {
    const u = Math.max(0, Math.min(1, t));
    const inv = 1 - u;
    return (
      Math.pow(inv, 3) * this.p0 +
      3 * Math.pow(inv, 2) * u * this.c1y +
      3 * inv * Math.pow(u, 2) * this.c2y +
      Math.pow(u, 3) * this.p3
    );
  }

  generateFrequencyCurve(points = 32, minFreq = 30): Float32Array {
    const curve = new Float32Array(points);
    for (let i = 0; i < points; i++) {
      const u = i / (points - 1);
      curve[i] = Math.max(minFreq, this.evaluate(u));
    }
    return curve;
  }
}
