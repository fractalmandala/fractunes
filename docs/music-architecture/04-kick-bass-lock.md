---
title: Kick Bass Lock
description: a good kick-bass is half the psy track done.
type: music-architecture
id: 4
---

A locked low end is a timing and tuning relationship, not a sound: the kick's tail must clear before the first bass note, both must be in tune in cents, and the sum must grow rather than cancel in mono. The kick is the source of truth; the bass adapts to it.

**1. Tune in cents, not semitones**

- Read the kick's actual pitch with a tuner (MTuner, Melodyne, Ableton Tuner) on a soloed or frozen hit and write it down.
- Tune the bass to that pitch with the synth's master fine-tune. Example: a kick ringing at 63 Hz against a bass C at 65.4 Hz is a \~40-cent gap and produces a \~2.4 Hz warble under every downbeat.
- Adjust until the beating slows to under one cycle per second. Lock the root; other bass notes may be slightly inharmonic against the kick, which is fine.

**2. Time the gap**

- The kick's sub tail (roughly 150–250 ms total, body 80–150 ms) must decay before the first bass note, or the two sines beat and turn to "phase soup".
- Fix by shortening the kick's amp release, and/or delaying the whole bass channel by 5–15 ms (track delay, not MIDI edits, so one control moves every note).
- Counter-observation: bass rendered from a synth often lags the kick by \~10 ms, in which case slide it earlier. Decide by the waveform and correlation meter, not by rule.
- Check visually: zoom the summed waveform at the overlap. Smaller at the overlap = cancellation; nudge until it grows.

**3. Phase and polarity**

- Try flipping bass polarity; if it sounds fatter, keep it.
- Use a correlation meter / oscilloscope (e.g. MultiOscillo) and aim for strongest positive summing around 60–70 Hz.
- Steep EQ cuts near the crossover smear phase — use linear-phase EQ there if needed.
- Always check in mono: clubs sum subs to mono. Thinning in mono means a phase problem, not a level problem.

**4. Duck with a shape, surgically**

| Method | Settings | Notes |
| --- | --- | --- |
| Volume shaper (LFO Tool, Kickstart, VolumeShaper) | Drop on the beat, hold 30–50 ms, ramp to unity over 60–80 ms | Tempo-locked, velocity-independent; what most pros use |
| Kick-keyed compressor | Attack \~0.1 ms, ratio ≥8:1, 8–12 dB GR, release 80–100 ms | Depth follows kick level |
| Light surgical sidechain | 2–4 dB GR, fastest attack, release 40–70 ms, back at 0 dB before step 2 | Should be inaudible; audible pump = too much |
| Low-band-only duck | Duck only below \~120 Hz, only where a bass note overlaps the kick | Mids keep breathing; ducking the whole bass hollows it |

- In busy 16th rolls shorten recovery to \~50–60 ms or reduce depth; on sustained notes, automate depth down or route to a parallel channel with \~150 ms recovery.
- Apply the same duck to pads, drones and atmospheres with energy below \~500 Hz so the whole low-mid breathes as one system.
- If the gain-reduction meter chatters on every bass note, the sidechain key is wrong.

**5. Assign frequency ownership** — two schools; pick one per track (see Open debates):

| Range | School A: bass carries sub (Myloops rolling-bass guide) | School B: kick carries sub (Myloops lock-in guide) |
| --- | --- | --- |
| < 30 Hz | Cut both (HPF bass 28–32 Hz, steep) | Cut both |
| 30–60 Hz | Kick keeps weight; bass reduced at kick fundamental | Kick owns 30–90 Hz; bass high-passed at 90 Hz, 24 dB/oct |
| 60–120 Hz | Bass fundamental and body; kick reduced | Bass owns 90–250 Hz; optional −3 to −6 dB kick dip \~150 Hz (Q 2–3) |
| 120–300 Hz | Bass warmth; notch kick boxiness \~200 Hz | Watch boxy build-up \~300 Hz |
| 300 Hz–1 kHz | Bass character; kick cut where it clashes | Shared, small moves |
| 1–5 kHz | Kick click and definition | Kick click; boost 2–3 dB if needed |

Other carving moves: notch the bass at the kick's exact fundamental (Q ≈ 4, a few dB); or cut the kick −1 to −2 dB (narrow) at the bass's key harmonics (for A: 55, 110, 220 Hz); or a dynamic EQ band on the bass keyed from the kick, 1–3 dB. A gearspace variant: steep 48 dB/oct HPF on the bass just above the kick sub (e.g. 46 Hz) and boost the kick's first harmonic (92 Hz) while cutting the same on the bass.

**6. Glue**

- Bass chain example: EQ (HPF) → saturation (Decapitator "A" or "E" drive \~3, or Saturn 2 tape/tube \~20%) → volume shaper → optional glue comp 2:1, attack \~20 ms, release \~80 ms, 1–2 dB GR.
- Parallel compression on a kick+bass group, blended under the dry signal, fattens without touching the dry low end.
- Glitch's rule of thumb: always compress the bass.