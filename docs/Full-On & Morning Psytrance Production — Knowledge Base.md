

## Kick–bass lock



## Drums, percussion and groove

Once kick and bass hold, the drums are what make people move, and the offbeat open hat between kicks is the single biggest source of psytrance's rolling drive. Layer drums in 8–16 bars at a time, never all at once.

**Entry order (from bar 1 of kick + bass)**: closed hats \~bar 17 → snare/clap \~bar 33 → open hat with a transition into the next section. Run the open-hat section no longer than about 64 bars before a reset.

**Hat techniques**

- Offbeat closed or open hat on the "and" between kicks (steps 3, 7, 11, 15).
- Rolling hats (Glitch): duplicate the offbeat hat, shift the copy by 1/16, damp its envelope heavily and tune it down one semitone; use this variation in the drop to lift energy.
- Random-trigger trick: load several closed-hat samples in a sampler, trigger randomly on 1/16s, render, then loop the best 1–2 bars; HPF the lows and add a light LFO-Tool duck for movement.
- Velocity: accent the notes you want felt; vary rather than fixing every hit at one velocity.
- Placement: hats can sit slightly off-centre with a complementary shaker/tambourine on the other side; kick and snare stay centred.

**Snare / clap**: on beats 2 and 4 (steps 5 and 13), sitting on top of the kick. A clap plus big reverb works as a "splash" on the first beat of a drop.

**"Digital" psy percussion (Serum)**: env 2 → osc 1 coarse pitch (full range), env 1 → volume, both short; browse spectral wavetables for drum-like tones; noise osc in one-shot mode with a misc attack sample; compress for uniformity; delay with sync off, very short time and high feedback for a "boing"; render to a sampler.

**Tribal / organic percussion (morning and Tristan-style)**: load a bongo sample into Serum's noise oscillator, map NoteOn Random → noise pitch (bipolar), add dotted-1/8 ping-pong delay, record a rhythm. Morning styles lean on tribal percussion and organic samples; full-on leans on crisp digital hits.

**Fill vocabulary**

- Empty or near-empty last beat of every 8th bar, with a 1/32 repeated, faded-in kick.
- Toms and bongos in the empty bar playing the same rhythm as the incoming lead.
- Eight quiet 1/32 kicks on the last beat before a section, faded in.
- Build kicks: 4 bars normal → 4 bars at double rate, plus a second double-rate kick offset by a 1/16 fading in; high-pass the kick group upward so it ends clicky.

**Polyrhythms**: a sequence with a prime number of notes (e.g. 11) against a step-sequenced amp pattern of another prime (e.g. 7) produces long, non-repeating variation; Spire handles this well.

## Harmony, melody, hooks and sequences

Psytrance harmony is sparse and modal: short motifs, arpeggios and sequences over a one-chord drone, with key and scale chosen once and held so bass, leads and pads agree. Full-on and especially morning full-on push brighter than the rest of psy — major or modally ambiguous leads that read as optimistic.

**Scales by mood**

| Scale / mode | Colour | Where it fits |
| --- | --- | --- |
| Natural minor (Aeolian) | Dark, emotional | Default for most psy |
| Phrygian (b2) | Exotic, tense, hypnotic | Classic psy/twilight bass and riffs |
| Phrygian dominant / Hijaz (b2, major 3rd, b6) | Eastern, dramatic | Goa, nitzhonot, oriental full-on hooks |
| Harmonic minor | Drama, Eastern flavour | Full-on leads and breakdown themes |
| Major / Lydian / Mixolydian | Bright, floaty, uplifting | Morning full-on leads, uplifting sequences |
| Dorian | Groovy, open minor | Morning progressive |

In Hindustani terms Phrygian corresponds to Bhairavi thaat — useful vocabulary when pairing psy with Indian melodic material.

**Key choice**

- Most-used keys: E, F, F#, G (a feelyoursound tutorial); D–G# generally.
- Psiger's guidance: avoid C, C# and B; F–G sound strong; G#–A# add drive; D–E add depth but are harder to mix. Vary the key between tracks rather than repeating one.
- Higher keys are easier to hear and forgive untreated rooms and cheap monitors; lower keys need more careful tuning.
- Harmonic layers: pads/atmos at +3 or +7 semitones over the root enrich harmony without leaving the scale.

**Writing hooks and melodies**

1. Start from rhythm and a short motif, not a run of notes. If you cannot hum it after one listen, neither can the crowd.
2. Use question-and-answer phrasing: one phrase asks, the next answers.
3. Repetition is how a hook is remembered — keep the core recognisable on each return, varying only slightly.
4. Cut notes rather than add them; give the hook space by thinning the arrangement when it plays.
5. Move it with automation (filter, volume, FX sends) so a short loop holds attention for minutes.
6. Reveal gradually (Liquid Soul-style): place the same MIDI clip every 4 bars but trimmed to 3, 4, 3, then 6 notes (full melody); lead in with a long-tail reverb of a single note.
7. Introduce a lead a bar or two early with delay or reverb so its entry feels earned.
8. If muting a lead makes the section better, cut it there.

**Uplifting sequences (morning full-on staple)**

- Placement decides lift: put the sequence where the arrangement rises, layered above the groove.
- Choose bright, clear sounds with high-frequency sparkle; dark, heavy tones weigh a sequence down.
- Keep the pattern simple and locked to the groove.
- Classic Spire arp trick (WAIO-style): step-mode arp through 0, 10, 12, 13 semitones with holds.

**Melody clashing with bass?** Move the melody up an octave or change register; if needed, change scale.

## Lead and synth sound design

Full-on leads are brighter and more present than progressive leads, and they get their life from per-note filter movement and constant modulation, not from preset density. Common tools: Serum/Serum 2, Spire (bright aggressive full-on leads), Sylenth1 (tight plucks, arps), Diva (warm pads), Dune 3 (big layered stereo leads), Access Virus (classic squelch).

**Recipes**

| Sound | Core recipe | Key moves |
| --- | --- | --- |
| Acid / Goa 303 lead | Saw → resonant low-pass | Dedicated mod envelope on cutoff, separate from amp env, fast; accents open the filter further; a little glide and detune for vintage feel; finish with OTT, delay, reverb |
| Saw squelch | Basic saw, Band-24 (band-pass) filter | One envelope (or env-mode LFO) → coarse pitch and cutoff together; step-LFO in trig mode at 1/16 for glitchy sequences; distortion + compression for grit; delay after compression |
| Classic "up-down" squelch | Pitch-bent saw with high-pass cutoff modulation | Sweeping a band-pass up while pitch falls confuses the perceived fundamental — a deliberate psychoacoustic trick |
| Gritty FM (Serum 2) | Six routes | Wave folding = controllable, evolving grit; ring mod = metallic, interval is a real parameter; FM from sub = deep grit with body (watch depth); osc-B / wavetable FM = evolving harmonics; phase distortion = least controllable; always shape the output filter curve |
| Infected Mushroom-style gritty FM lead | FM from osc B into osc A | Map pitch-bend to osc B semitone for expressive FM movement |
| Ajja-style gated leads | Sine (Basic Shapes) FM'd by a wavetable in osc B; second patch saw with sine LFO on coarse pitch and inverted Band-24 cutoff | Record, add long-tail delay, cut into 2-beat clips placed 2 bars apart, then 1 bar apart after 16 bars; second patch answers the first; gate with LFO Tool rhythms |
| Hypnoise-style spectral morph | Chaos osc (BPM-synced, S&H, 1/16) → full-range wavetable position | Tables: AlienSpectral, Gremlin, Monster 3, Reesey Mess, Squelchy FM 1; render 8 bars, chop into 2-beat blocks, keep the best, place every 2 bars, dotted-1/4 delay |
| Supersaw / uplifting lead | Saws, modest detune, LPF with resonance | Envelope/LFO on cutoff; quarter- or 1/8-synced LFO on cutoff plus a slower LFO on wavetable position or detune |

**Arp and sequence rules**

- Sequence 16ths with accents and occasional 1/32 fills; mix tied and staccato notes against the bass groove.
- Use pentatonic or modal fragments that repeat with gradual note changes.
- WAIO-style hand-made tails: bounce the arp, chop every 3 beats, trim each piece to 3/16 and repeat 4× to fill, then taper a filter to mimic a long-tail delay. Arrange as 8 bars MIDI build → 4 bars chopped with rising filter → 8 bars chopped with tapered filter.
- Render leads to audio early: you can cut delay tails exactly and it opens up glitch edits.

**Lead mixing**

- High-pass leads and clean low-mids with mid/side EQ; keep some mono compatibility in unison stacks and high-pass the widest layers.
- Distortion/exciters help leads cut; watch harsh 3–6 kHz and ear fatigue on small speakers.
- Delay 1/8 or dotted-1/8, 15–25% wet on a return; u-he Colour Copy is a favourite for long-tail psy delays.

## FX, atmospheres, ear candy and vocals

Psytrance is more FX-driven than almost any other genre: zaps, impacts and small events land every few bars, and transitions depend on risers, downlifters and delay throws. The rule is motion — spatial (pans, dopplers), spectral (filter and formant sweeps) and rhythmic (stutters, gates).

**Ear-candy palette**: laser zaps, bit-crushed blips, gated noise, granular shimmers, reverse swells, dopplers, comb-filtered and phase-flanged sweeps, resonant band-pass stabs, vowel/formant filtering, modulated delays. Punctuate transitions with percussive FX hits rather than busy loops.

**Techniques**

- Kick to infinity: retrigger the kick faster and faster while pitching it up (e.g. 16 semitones on a rising curve) until the repeats become a tone. In Ableton: kick in Sampler, envelope → loop length, bounce, then automate transposition in Complex Pro.
- Delay-feedback riser: feedback \~100%, automate delay time; works well on vocals. Put a limiter after it — mistakes are loud.
- Long-tail delay throws: chop the last bar of a synth to 2 bars and feed a long-tail delay (Colour Copy) into the breakdown.
- Resampled chaos: render kick+bass, perc and lead, jumble them (Buffer Shuffler in Ableton, LoopMash in Cubase), record random tweaking, chop into 1-bar clips for breaks, some with rising band-pass.
- Granular atmospheres from the track's own sounds (VCV Rack Texture Synthesizer); mid/side EQ cutting more low end from mid than side for width; a 1/4 LFO-Tool pump.
- Atmos from harmony: build a pad on the same notes as the arp for breakdowns and builds.
- Mask abrupt entries: place atmosphere one or two bars ahead of a new melody.
- Announce every section change with a sweep, stab or FX hit into a crash.

**Vocals and samples**

- Full-on classically uses spoken or cinematic samples dropped into near-silence at the breakdown, then the kick returns.
- Morning styles favour ethereal female chants, mantra vocals, guitars and ethnic instruments.
- Processing ideas: gating, pitch modulation, delay throws; keep them sparse so they read as events.
- Use only samples you have rights to; sample-pack FX (risers, impacts, downlifters) translate freely across trance subgenres.

## Arrangement and energy

Good psytrance arrangement is energy that keeps climbing, with resets placed on purpose; tracks run about 7–7.5 minutes (6–9 across sources) and every change lands on an 8-bar grid. Small changes every 8 bars, bigger shifts every 16, section changes every 32.

**Template bar map (272 bars at 145 BPM ≈ 7:30)** — a starting skeleton assembled from the sources, not a fixed rule:

| Bars | Section | Contents | Purpose |
| --- | --- | --- | --- |
| 1–16 | Intro A | Kick + bass only (or kick + top loop, then bass at 17) | DJ mix-in; your reference groove |
| 17–32 | Intro B | + closed hats, first percussion | Build groove |
| 33–48 | Groove 1 | + snare/clap, first hint of key via filtered pad or FX | Harmonic hint |
| 49–64 | Groove 2 | + open hats, short lead fragment; FX/fill into 65 | Transition signal |
| 65–128 | Main part 1 | Lead/hook enters; sequences change every 8–16 bars (full-on: ≤ 32 beats per sequence); ≤ \~64 bars of open hats | First peak |
| 129–160 | Breakdown | Drums and bass out; pads, theme, cinematic sample or vocal in near-silence; riser | Emotional reset |
| 161–176 | Build | Lows cut, highs up, snare/kick rolls, risers; last bar near-empty | Tension |
| 177–240 | Drop / main part 2 | Full hook + answer phrase, new element or groove variation after 16 bars | Main peak |
| 241–272 | Outro | Strip elements in reverse of the intro; kick + bass last; end on a downbeat, no fade | DJ mix-out |

**Rules of thumb**

- Start with 16 bars of kick and bass only; judge every later element against it.
- Energy only goes up within a section; avoid slope-down moments (pulling the snare in atmospheric parts, drowning a rise in reverb).
- After a big groove section, drop to a dry kick and bass for a few bars — the reset makes the next element hit harder.
- When a section gets muddy, the fix is almost always fewer elements, not more processing.
- Every sustained element should have at least one parameter moving; the simplest is a diagonal filter automation rising over 16 bars.

**Building a drop**

1. The build must undermine the energy the drop delivers: cut lows, boost highs, automate volume and FX upward — everything moving in one direction.
2. Replace open hats with lower-intensity closed hats; fade the percussion group out as a snare roll fades in.
3. Remove bass entirely for the 8 bars before the drop; high-pass the kick group to clicky.
4. Kick build: 4 bars normal, 4 bars double rate, plus a 1/16-offset double-rate kick fading in; last bar empty.
5. Layer risers — some ending a bar early, some right at the drop — plus downlifters.
6. Leave one bar near-empty: an "epic" lead phrase, or toms/bongos in the lead's rhythm, or 1/32 kicks.
7. Contrast beats volume: pull energy back just before the drop, then release fully.
8. First beat of the drop: a "splash" (clap + big reverb); later bring the lead's answer phrase.

**Breakdown moves**

- Bounced kick+bass+perc loop at the start of the breakdown: taper 2 bars with dotted-1/4 delay, or low-pass out, or high-pass out. One sequence: low-pass out → delay → delay → low-pass in.
- Band-pass sweep up over the last 4 bars on kick and bass only.
- Swap the main lead for a variation; remove atmospheres; leave kick, bass and lead only in the last 4 bars.

**The part after the drop** — where tracks lose momentum:

- Introduce a new element, vary the groove or shift focus so the section evolves.
- Blend elements across the boundary instead of switching abruptly.
- Use low-pass dips and re-openings to shape rise and fall.

**Arranging aids**: drop a reference track in the session and add sketch lanes beside it — sections, percussion energy (stronger colour = more energy), synths/FX — to copy its energy map.

## Mixing

In psytrance, arranging and mixing happen together, because how many elements play at once is itself the mix decision. Keep the low end mono and centred, leave headroom, and create width at the channel level, never on the master.

**Structure and gain**

- Buses: drums (kick, snare, hats, perc), bass (sub, top layers, bass FX, group-level kick duck), synths (leads, arps, pads), FX, and reverb/delay returns.
- Headroom: individual tracks peaking around −12 to −6 dBFS; mix bus peaking around −6 dBFS before mastering.
- Mix-bus rule: if you cannot say in one sentence what a plugin on the mix bus does, remove it; three plugins is plenty.
- Level anchor: kick loudest, bass close to it (about 2–3 dB below) — psy bass sits near kick level, not tucked underneath.

**Low end**

- Everything below \~120–200 Hz mono. Check mono often: a mix should not turn cloudy in mono.
- High-pass non-bass elements; high-pass reverb and delay returns at 100–200 Hz.
- Apply the kick duck to anything with energy below \~500 Hz (pads, drones, atmos).

**Width and space**

- Width comes from panning, stereo synthesis, and per-element widening on mids/highs (leads, pads, hats, some percussion). Pan is not the same as width.
- Polyverse Wider (free, co-developed with Infected Mushroom) widens while summing back to the original in mono.
- Avoid master-bus wideners; they break mono compatibility.
- Reverb: pre-delay 20–40 ms (up to 80 ms on leads); longer decays (2–4 s) in breakdowns, shorter (0.8–1.5 s) in drops; automate return levels between sections. Too much reverb blurs 16th-note energy.
- Delay: 1/8, dotted-1/8 or dotted-1/4, 15–25% wet on returns; place delay after compression so tails are not squashed.

**Tone and glue**

- Low-mids 200–500 Hz are where elements fight; clean boxiness around 300 Hz.
- Saturation on bass (or a kick+bass bus) adds shared harmonics in 300 Hz–3 kHz and helps translation to phones and laptops.
- Multiband compression helps where kick and bass must coexist with dense mids.
- Listen at very low volume to judge kick/bass balance; check on laptop speakers and phones — if the bass disappears there, it needs more 200–500 Hz.

## Mastering and loudness

Commercial psytrance measures around −8 LUFS integrated for club use, while streaming platforms normalise to about −14 LUFS; a well-balanced mix should reach club loudness with no more than 4–6 dB of limiting. Needing 6–8 dB or more means the mix, not the master, is broken — usually kick, snare and bass not under control.

| Target | Integrated loudness | True peak | Notes |
| --- | --- | --- | --- |
| Club / DJ master | ≈ −9 to −6 LUFS (psy references measure ≈ −8) | ≤ −1 dBTP recommended; −0.1 to −0.3 dB ceiling is common for club files | Loud masters louder than −14 LUFS should stay below −2 dBTP to survive lossy encoding |
| Streaming master | ≈ −14 LUFS (Spotify's normal level; −11 on "Loud") | ≤ −1 dBTP | Normalisation turns loud masters down; extreme limiting costs punch |
| Forum practice | Master versions at −8, −12 and −14 LUFS and test them on the target systems | — | Label or mastering engineer may redo it anyway |

**Chain (in order)**

1. Fix the mix first: HPF 25–30 Hz, tame 200–350 Hz build-up, consider a dip around 2.8–3.5 kHz.
2. Serial gentle compression: a slow glue stage around 0.5 dB GR, then a second gentle stage — not one compressor doing 4 dB.
3. Light harmonic saturation before the limiter — roughly 1 dB of perceived loudness for free.
4. Clipper to shave transients (preserves punch better than limiting alone).
5. Limiter last, oversampled, true-peak aware, ceiling −1 to −0.1 dBTP depending on destination.
6. Loudness meter (e.g. Youlean) at the very end; compare against references level-matched within 0.5 dB.

**Checks**: bypass-compare regularly; mono-check the sub; export WAV 24-bit, 44.1 or 48 kHz; keep stems for collaborators and labels.

## Workflow and referencing

Finishing beats perfecting: build the track brick by brick, bounce to audio often, and log problems instead of fixing them mid-flow.

- Three stages: create sounds and clips → pre-mix while arranging → final mix. Write problems on a list during stages 1–2 and tick them off in stage 3.
- Bounce MIDI to audio frequently; in Ableton keep the originals as clips so you can revert.
- Build a template: kick/bass channels with ducking pre-routed, buses, sends, reference channel and loudness meter.
- Keep a library of your best basses and kicks saved by key, plus a list of finished tracks by key and BPM for fast starting points.
- Some producers write with a limiter on the master to hear final loudness; opinions differ.
- Reference routine: pick 2–3 references matched to the subgenre (Zenon, Nano, Iono, Blacklite, or artists such as Astrix, Vertical Mode, Ace Ventura, Symbolic). Route them around the master chain, match loudness, then compare kick weight and length, kick/bass balance, the silence gap after each kick, bass grit, and the analyser curve (a scoop vs a bump at 150 Hz, for instance). Use meters to guide the ear, not to trace curves.
- Rest your ears and re-listen next morning on several systems: monitors, headphones, phone, car.

## Open debates

Sources genuinely disagree on several low-end decisions; an agent should present the options and decide by listening and metering, not by picking one rule.

| Question | Position A | Position B | Suggested agent default |
| --- | --- | --- | --- |
| Who carries the sub? | Bass carries it via a mono sine sub layer; kick is short | Kick carries it; bass high-passed at \~90 Hz; never layer a sine under the bass | Check the kick's 50–65 Hz energy first: strong kick sub → B; short, thin kick → A |
| Bass timing | Delay bass 5–15 ms so the kick tail clears | Bass often lags \~10 ms; slide it earlier | Measure on the waveform/correlation meter and move whichever way sums bigger |
| Sidechain depth | 2–4 dB, inaudible, surgical | 8–12 dB compressor or a shaped full duck | Shaped duck on the low band; deepen only if the kick transient is masked |
| Rhythm label | Classic full-on = K-B-B-B 16ths | Many describe the psy bass as a "triplet"/galloping roll | Both exist; confirm the user's reference track |
| Kick tuning | Kick on the track root | Kick on another scale degree (3rd or 5th) or a semitone off the bass root to avoid clash | Root by default; retune only if the tuner shows beating |
| "Morning" | Morning full-on (\~143–146, melodic, Israeli roots) | Morning progressive (138–142, warm, organic) | Ask the user which, or infer from BPM and references |
| Phase alignment | Must be perfect | Phase-aligned kick/bass matter less than timing and tuning | Always pass the mono check; beyond that, ears decide |

## Quick reference and agent checklists

**Tempo maths**: 1/16 note (ms) = 15000 ÷ BPM. At 145 BPM: 1/16 ≈ 103 ms, 1/8 ≈ 207 ms, 1/4 ≈ 414 ms; at 148: 101 / 203 / 405 ms. A bar = 240000 ÷ BPM ms.

**Note → sub frequency (octave 1, A4 = 440)**: D 36.7 · D# 38.9 · E 41.2 · F 43.7 · F# 46.2 · G 49.0 · G# 51.9 · A 55.0 · A# 58.3 · B 61.7 Hz (double for octave 2).

**Low-end checklist**

- [ ] Kick chosen first; pitch read with a tuner and written down
- [ ] Kick length ≈ 1/8 note; body decay 80–150 ms
- [ ] Bass tuned to the kick in cents; beating < 1 Hz
- [ ] Bass amp: sustain 0, note silent before next 16th; poly/retrig mode; phase reset
- [ ] Sub owner decided (kick or bass); EQ split enforced; HPF below \~30 Hz
- [ ] Gap visible between kick tail and first bass note; bass channel offset set
- [ ] Duck shaped, recovered to 0 dB before step 2; applied to low pads too
- [ ] Polarity tried; mono check passes; correlation positive at 60–70 Hz
- [ ] Saturation only above \~150 Hz

**Full-on character checklist**

- [ ] 144–148 BPM; key in D–G# (not C, C#, B)
- [ ] Rolling bass with melodic/octave movement every few bars
- [ ] Sequences change within \~32 beats; something small changes every 8 bars
- [ ] Bright lead with per-note filter motion; hook hummable after one listen
- [ ] Breakdown with near-silence and a sample/vocal, then hard return of kick and bass
- [ ] Morning flavour: major/Lydian colour, uplifting sequences, organic or ethnic textures

**Release checklist**

- [ ] 16-bar kick+bass intro and outro for DJs; ends on a downbeat, no fade
- [ ] Mix bus peaks ≈ −6 dBFS pre-master
- [ ] Master ≤ 4–6 dB limiting; club ≈ −8 LUFS, streaming ≈ −14 LUFS; true peak ≤ −1 dBTP
- [ ] Compared to 2–3 level-matched references on at least three systems

## Sources

Pages opened in full are marked with an asterisk; the rest were used from search excerpts.

**Kick and bass**

- [How to Make a Psytrance Rolling Bassline That Locks With the Kick — Myloops](https://www.myloops.net/how-to-make-a-psytrance-rolling-bassline) \*
- [Psytrance Kick and Bass: A Frequency-by-Frequency Lock-In Guide — Myloops](https://www.myloops.net/how-to-make-psytrance-kick-and-bass-work-together) \*
- [How to Make a Psytrance Full-On Bass in Serum 2 — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/psytrance-bass-serum/) \*
- [How to Make a Psytrance Kick in Serum 2 — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/psytrance-kick-drum-serum2/)
- [PsyTrance Kick Process — CineTrance](https://cinetrance-records.com/blogs/cinetrance-blog/psytrance-kick-process)
- [How to fit kick and bass together — D. Sokolovskiy](https://dsokolovskiy.com/blog/all/how-to-fit-kick-and-bass-together/)
- [Psytrance bassline synthesis — D. Sokolovskiy](https://dsokolovskiy.com/blog/all/psytrance-bassline-synthesis/)
- [ShapeMaster PsyTrance Kick — Patchstorage](https://patchstorage.com/shapemaster-psytrance-kick/)
- [Psytrance kick drum with Kick 2 — Steemit](https://steemit.com/music/@mume/music-production-software-psytrance-kick-drum-with-kick-2)
- [How is this kick made? — KVR forum](https://www.kvraudio.com/forum/viewtopic.php?t=531415&start=15)
- [How to make this Psy Trance Bass — KVR forum](https://www.kvraudio.com/forum/viewtopic.php?t=522638)
- [Mixing Bass & Kick Checklist — Gearspace](https://gearspace.com/board/electronic-music-instruments-and-electronic-music-production/1371142-mixing-bass-amp-kick-checklist-whats-yours.html)
- [Psytrance bassline tutorial — FeelYourSound](https://feelyoursound.com/articles/psytrance-basslines/)
- [Get a Powerful Low-End: Mix Kick and Bass — mastrng](https://mastrng.substack.com/p/mixing-kick-and-bass)

**Sound design, melody, arrangement**

- [How To Make Psytrance (Glitch tutorial notes) — Matt Howlett](https://www.matthowlett.com/2019-07-06-how-to-make-psytrance.html) \*
- [Psytrance Arrangement: The 7 Rules of Structure — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/better-psytrance-arrangement/) \*
- [The Secret to a Huge Psytrance Drop — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/secret-huge-psytrance-drop/) \*
- [3 Tips for the Part After the Drop — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/part-after-the-drop/) \*
- [3 Tips for Better Psytrance Hooks — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/better-psytrance-hooks/) \*
- [3 Tips for Better Psytrance Melodies — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/three-tips-better-melodies/) \*
- [Uplifting Sequences for Psytrance — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/uplifting-sequences/) \*
- [6 Ways to Make Gritty FM in Serum 2 — Psytrance Blueprint](https://www.psytrance-blueprint.com/tutorials/gritty-fm-fullon-serum2/) \*
- [How to Make a Goa 303 Acid Lead — Psytrance Blueprint](https://psytrance-blueprint.com/tutorials/goa-303-acid-lead/)
- [How to Make Psytrance Leads — Plugg Supply](https://plugg-supply.net/articles/how-to-make-psytrance-leads-2027)
- [Psytrance LEAD, what's the exact way? — Gearspace](https://gearspace.com/board/electronic-music-instruments-and-electronic-music-production/568781-psytrance-lead-whats-exact-way-do.html)
- [Understanding Scales & Modes in Psytrance — Outerverse.fm](https://outerverse.fm/blogs/tutorials/understanding-scales-modes-in-psytrance)
- [Phrygian mode — Wikipedia](https://en.wikipedia.org/wiki/Phrygian_mode) · [Phrygian dominant scale — Wikipedia](https://en.wikipedia.org/wiki/Phrygian_dominant_scale)
- [Top 15 VST Plugins for Psytrance Production — Myloops](https://www.myloops.net/top-15-vst-plugins-for-psytrance-production)
- [Anatomy of a Trance Arrangement — Myloops](https://www.myloops.net/analyzing-the-arrangement-of-a-professional-trance-track)
- [Uplifting Trance Arrangement: The 8-Minute Blueprint — Myloops](https://www.myloops.net/how-to-arrange-an-uplifting-trance-track-from-start-to-finish)

**Genre**

- [Psychedelic trance — Wikipedia](https://en.wikipedia.org/wiki/Psychedelic_trance)
- [List of trance genres — Wikipedia](https://en.wikipedia.org/wiki/List_of_trance_genres)
- [Full-On Psytrance — Rate Your Music](https://rateyourmusic.com/genre/full-on-psytrance/) · [RYM Ultimate Box Set: Full-On](https://rateyourmusic.com/list/TheScientist/rym-ultimate-box-set-full-on-psytrance/)
- [Psytrance Guide](https://psytranceguide.com/) · [DMT FM subgenre guide](https://dmt-fm.com/psytrance-ultimate-guide-to-subgenre/)
- [Psytrance Subgenres — TIMBR Radio](https://timbr.music/blog/psytrance-subgenres)
- [Morning Psytrance — Takora](https://progressive-psytrance.com/morning-psytrance)
- [What is "morning psytrance"? — Psynews](https://www.psynews.org/forums/topic/73681-what-is-morning-psytrance/)
- [Morning full-on tag — Last.fm](https://last.fm/tag/morning+full-on) · [Full on tag wiki — Last.fm](https://www.last.fm/tag/full+on/wiki)
- [Psytrance](https://www.melodigging.com/genre/psytrance) and [Hi-Tech Full-On](https://www.melodigging.com/genre/hi-tech-full-on) — Melodigging

**Mixing and mastering**

- [Mastering Uplifting Trance — Myloops](https://www.myloops.net/mastering-an-uplifting-trance-track)
- [5 Common Mix Issues in Trance — Myloops](https://www.myloops.net/5-common-mix-issues-in-trance-production-quick-fixes)
- [LUFS settings — PsyMusic UK](https://www.psymusic.co.uk/forum/threads/lufs-settings.81364/)
- [Stereo field in psytrance — PsyMusic UK](https://www.psymusic.co.uk/forum/threads/stereo-field-in-psytrance.70757/)
- [Mastering dance music: too much limiting — Gearspace](https://gearspace.com/board/mastering-for-beginners/1352585-mastering-dance-music-too-much-limiting.html)
- [Loudness normalization — Spotify for Artists](https://artists.spotify.com/help/article/loudness-normalization)
- [Gain Staging, Routing and Busses — KAN Samples](https://kansamples.com/blogs/learn/gain-staging-routing-mix)
- [Trance Mixing Tutorial — Steve Allen](https://tranceproducer.co.uk/blogs/news/trance-mixing-tutorial-getting-your-track-release-ready)
- [How to Use Clipping in Mastering — Mix & Master My Song](https://mixandmastermysong.com/how-to-use-clipping-in-mastering-for-loudness/)

**Paid courses worth knowing (not reviewed)**: E-Clip Psyentific Master Course (kick and bass, full-on/prog/forest), Ollie Psy kick courses, CineTrance Psy-Trance Masterclass, Psytrance Blueprint (MoRsei and Psiger), Glitch's YouTube "Creating Psytrance" series.
