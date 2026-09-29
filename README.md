# Fractunes

A modular audio workstation built as a **Rust native app with a SvelteKit frontend (via Tauri v2)**. Is mostly just a personal toy, and a way to learn rust, tauri, svelte.

## ⚡ Tech Stack & Architecture

- **Desktop Shell & Native Core**: [Tauri v2](https://v2.tauri.app/) (Rust)
  - Native window
  - Native MIDI hardware controller detection via `midir`
  - Bit-exact, multi-threaded 16-bit 44.1kHz PCM WAV stem and master export directly to disk via `hound`
  - User soundbank preset persistence (`.json`)
- **Frontend & DSP Surface**: SvelteKit (Svelte 5 with `$state`, `$derived`, `$effect` runes)
  - High-precision audio scheduling & lookahead sequencing
  - Interactive Canvas controllers (Cubic Bezier Kick Envelope, 3D Waterfall Wavetable Mesh, Filter Response Curve, Spectrum Analyzer, Master Oscilloscope)

**Doc from here onwards is not up to date, and mostly stale. App is constantly WIP so I leave things here as they are**:

## 🎛 Rack Modules

1. **Mixer**: 5-channel fader strip (Kick, Bass, Lead, Hats, Out) with individual mutes, gain, and stereo pan.
2. **Transport & Soundbank**: Preset selector (Electro Sun, Vibe Tribe, System Nipel, Sesto Sento, Bizarre Contact, Progressive Dawn, etc.), real-time oscilloscope, play/pause, BPM drag, key & timecode.
3. **Stems & Buffer**: Master Take export (WAV), 4-stem export, and live MIDI device status.
4. **Psytrance Kick**: Interactive Cubic Bezier frequency envelope curve canvas, root pitch, pitch decay, volume decay, and punch amount.
5. **Metallic Hats**: 6-oscillator inharmonic cluster + noise burst, highpass cutoff, resonance (Q), closed & open decay with open choke.
6. **Wavetable Synth**: Serum-style wavetables (Supersaw, Acid 303, FM Squelch, Rolling, Formant, Bell, Distorted Saw), Warp modes (Bend, Sync, PWM, FM), unison voices, and 3D wireframe mesh canvas.
7. **Filter Strip**: Interactive frequency response curve canvas (drag cutoff & resonance), 12dB/24dB slope selector, chromatic/minor scale, tone offset, and wet FX send.
8. **Delay**: Ping-pong stereo delay with concentric radar visualizer, dotted-8th tempo sync, feedback, and damping filter.
9. **Reverb**: Schroeder reverb network with 3D isometric room visualizer, size, decay, and wet send.
10. **Modulators A & B**: Dual LFO engines (Sine, Triangle, Saw, Square, Fold) modulating filter cutoff and wavetable warp amount.
11. **KBBB Sequencer**: 16-step rolling gal-op matrix, live playhead tracker, pattern slots A/B, drum fill, octave turnarounds, and swing shuffle.

**Global Keyboard Shortcuts**
- `Space`: Play / Stop sequencer
- `1`: Trigger Kick
- `2`: Trigger Closed Hat
- `3`: Trigger Open Hat
- `4`: Trigger Rolling Bass note


## 🚀 Running the App

### Web Dev Mode (Browser Preview)
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Native Desktop Dev Mode (Tauri + SvelteKit)
```bash
pnpm tauri dev
```
Launches the native desktop application with hot module replacement (HMR).

### Building Native Desktop App & DMG / Installer
```bash
pnpm tauri build
```
Creates the standalone optimized native bundle in `src-tauri/target/release/bundle/`.
