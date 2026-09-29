---
title: Kick Design
description: how to design great kick sounds.
type: music-architecture
id: 2
---

A psytrance kick is essentially a sine wave with a fast pitch envelope that resolves onto the track's fundamental, shaped by an amp envelope; everything else is refinement. It is a short tonal note that defines the track's root, so design or choose the kick first and build the bass around it.

**Anatomy and target numbers (modern full-on)**

| Property | Typical value | Notes |
| --- | --- | --- |
| Fundamental | 50–70 Hz; commonly tuned to F, F#, G (G ≈ 49 Hz in octave 1) | Many stock samples sit on G; verify with a tuner — readings often fall between semitones |
| Body decay | 80–150 ms for full-on; shorter for forest | This number drives bass timing |
| Total length | Often exactly one 1/8 note (≈ 208 ms at 144 BPM) | Second 1/16 of the pitch envelope sits on the fundamental, easing phase with the first bass 16th |
| Click / transient | 2–5 kHz | Boost 2–3 dB here if it does not cut |
| Mud cut | Notch around 200–300 Hz | Tightens the kick; many psy kicks have a notable cut near 300 Hz |

**Build steps (any synth: Kick 2, Serum 2, MSEG-based modular)**

1. One sine oscillator, phase reset/retriggered on every hit so every kick is identical.
2. Pitch envelope: a fast, deep drop from very high to the fundamental. A shorter, steeper curve gives a tight, clicky "zap"; a longer curve gives a boomier thump. This envelope defines the character — spend most of the time here.
3. Amp envelope: sets the length. Keep it short so the offbeat bass has room. Advanced trick: the "fishtail" shape — a loud snappy transient, a brief dip, then the boom — needs a multi-point envelope (MSEG).
4. In Kick 2, each point on the amp envelope corresponds to a frequency in the pitch sweep, so the amp envelope doubles as an EQ over the sweep.
5. Optional click layer (sampled) for definition; Kick 2 offers three click sources with independent key-tracking.
6. Optional: layer a short sine sub tail under the kick itself (triggered from the kick MIDI, tuned to its fundamental) if the kick lacks energy at 50–65 Hz — useful for automating sub in intros and breakdowns.

**Processing**

- A light chain is enough: EQ → compressor → compressor (CineTrance's studio chain). Strong source sound beats heavy processing.
- Multiband distortion adds crispness up top without distorting the sub. Never heavily saturate the sub region; if saturating, high-pass the saturator input around 150–200 Hz.
- Kick level sits about 2–3 dB above the bass; the kick is the loudest element.
- Subgenres have strict kick conventions — do not use a goa kick in progressive or a full-on kick in darkpsy; transient, pitch, body and length all differ.