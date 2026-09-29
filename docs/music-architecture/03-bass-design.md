---
title: Bass Design
description: the technique of a psytrance bassline.
type: music-architecture
id: 3
---

The rolling bass is the engine of the track: every note must be an identical, self-terminating stab that dies before the next one fires. Put roughly 90% of effort into the synthesis and 10% into the MIDI — weak sound design, not a simple pattern, is what kills basslines.

**Patch recipe (Serum / Serum 2 / Sylenth1 / Vital / Spire)**

| Parameter | Starting value | Why |
| --- | --- | --- |
| Oscillators | 1–2 saws (aggressive full-on) or square; triangle for softer, forest-leaning; osc B an octave up | Saw = bite; octave stack = body |
| Oscillator phase | Fixed at 0, random phase off (Serum inits to random — reset it) | Identical note starts; avoids phase drift against the kick |
| Unison | 1–2 voices, tiny detune at most; widen with unison not sub detune | Detuned lows phase-cancel in mono |
| Filter | Low-pass 24 dB (ladder / LPF24) or 12 dB; cutoff \~400–700 Hz (\~500 Hz start); resonance near 0 (Serum inits \~10%) | Dark, controlled tone |
| Amp envelope | Attack 0–3 ms, decay 60–90 ms, sustain 0, release 20–40 ms | Must be silent before the next 16th (≈ 90 ms after trigger at 145 BPM) |
| Filter envelope | Attack \~0, decay \~40 ms, sustain 0, depth ≈ one octave of cutoff | The per-note "chirp"/"brrrp" that reads as psy; too deep = acid, too shallow = dead |
| Voice mode | Poly or retrigger, never legato (for rolling bass) | Legato stops envelopes retriggering |
| MIDI note length | \~½–¾ of a 16th (50–75 ms at 145 BPM) | Consistency matters more than exact length |

Extras: two envelopes on cutoff (one longer) give a pluckier attack; separate LFOs/envelopes for the click and for lows/mids give finer control; a randomised saw through Serum's downsampler (drive \~40) adds vowel-like, near-FM grit.

**Layering: split sub from top**

- Sub layer: mono sine (root \~F1–A1, 43–55 Hz), untouched, loudest part.
- Top layer: filtered saw/square, sits noticeably lower in level; carries the character heard on small speakers.
- Top-layer chain: high-pass 100–150 Hz → saturation (tube/tape/mild wavefolder) → low-pass or tilt around 3–5 kHz → sum with the clean sub. Saturate only the top, never the sine.
- Keep everything below \~200 Hz mono; any width goes on the top layer above 200 Hz.
- If the synth cannot route oscillators to separate chains, use two synth instances on two tracks.

**Core patterns (16-step bar, kick on 1, 5, 9, 13)**

| Pattern | Bass steps | Feel / use |
| --- | --- | --- |
| Classic rolling (K-B-B-B) | 2,3,4 · 6,7,8 · 10,11,12 · 14,15,16 | The full-on engine |
| Two-note roll (K-B-B-\_) | 2,3 · 6,7 · 10,11 · 14,15 | Lighter, more space; common in full-on |
| Offbeat (K-*-B-*) | 3 · 7 · 11 · 15 | Progressive / morning-prog bounce |
| Triplet / gallop | Three notes per beat on a 1/12 or 1/24 grid | Galloping full-on variant |
| Prog variation (from a Glitch tutorial) | 3/16 rest, 1/16 note, 1/8 rest, 1/8 note, repeat | Syncopated progressive feel |

**Adding movement without breaking the pulse**

- Full-on specific: write melody into the bass — move across scale notes and octaves while keeping the 16th grid intact.
- Octave drop on one of the twelve notes every 4 or 8 bars.
- Root swaps: hold the root 8 bars, move to the 5th or minor 3rd for 2 bars, return.
- Strategic mutes: drop the last 16th of every 4th bar to pull the ear forward.
- Slow cutoff automation on the top layer across 16–32 bars.
- Fills: 1/32 bursts at the start of a bar (e.g. 1/16 rest, six 1/32s, two 1/16s), or 8×1/32 with the filter open on a second track; chop and interleave variations.
- Rolling-bass rule: no glides or pitch bends on the sub (save portamento for a separate lead bass). Legato plus portamento with an octave-up final 16th is a valid progressive variation, not a full-on default.
- Hi-tech full-on (Japanese) variant: switch bass patches every bar or half-bar (FM growl → wavetable zap → formant buzz) while keeping spectral balance consistent.

Synthesize the bass rather than using samples; save your best basses by key so each new track starts from a proven patch.
