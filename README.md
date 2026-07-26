# SIGIL//FORGE

> a DaemonSoftworks ritual instrument

A browser-based sigil generator. Type an intent, pass the four rules, and the
forge distills your sentence into a circuit-board mark — straight traces,
solder-pad dots, an octagon shackle. Built with vanilla HTML/CSS/JS, no
dependencies, no build step. Drop the folder on any static host and it runs.

**Live at:** euripidec.github.io/Sigil-Forge/

---

## The Four Rules

An intent is only accepted when it honors the rules of sigil craft:

1. **Present tense** — the sigil speaks of now, never later
2. **Never "I want"** — wanting keeps a thing at arm's length
3. **Be realistic** — only you can judge this one (the honor rule)
4. **Precise, ~7 words** — the forge accepts 5 to 9

**Bonus:** no negative words — phrase it toward, never away. Breaking the
bonus warns but doesn't block; breaking rules 1, 2, or 4 locks the forge
until the intent is fixed.

## How a Sigil Is Forged

1. **Distillation.** The sentence is capitalized, then every vowel and every
   repeated consonant is struck out — visibly, in the panel. The surviving
   letters are the raw material.
2. **Letter influence.** Each surviving letter maps to a stroke motif from a
   fixed vocabulary (crossbars, elbow branches, diamonds, chevrons, forks,
   zigzags…), hung in reading order down a central spine. Letter count adds
   weight: 5+ letters grow chevron feet, 7+ grow the symmetric outer arms.
3. **Chance arrangement.** Proportions, sides, scales, and jitter are rolled
   fresh on every forging. The letters shape the mark; chance arranges it —
   the same intent never wears the same sigil twice.

The visual language is derived from the DaemonSoftworks bashemoth sigil:
octagon frame, straight strokes only, dot terminals, baseline + spine
skeleton, crown ring.

## Files

| File         | Role                                                       |
| ------------ | ---------------------------------------------------------- |
| `index.html` | Structure — the intent panel, rules list, and stage        |
| `styles.css` | The DaemonSoftworks skin: `#0d0d0f` / `#e63946` / IBM Plex Mono, scanlines, targeting brackets, the materialize animation |
| `sigil.js`   | Everything else: distillation, rule validation, the motif vocabulary, SVG generation, the forge sequence, download/copy |

## Using It

- Type your intent — validation and the strikethrough respond live; the forge
  runs ~1s after you stop typing
- **> forge again** re-casts the same letters into a new arrangement
- **download svg** saves the mark (transparent background — it's made for
  dark surfaces)
- **copy svg** puts the raw markup on your clipboard

## Tuning

A few dials worth knowing, all in `sigil.js`:

- `LETTER_MOTIF` — rebind any letter to a different motif
- `MOTIFS` — add new stroke shapes to the vocabulary
- `TENSE_MARKERS` / `NEGATIVE_WORDS` — tune the rule detection
- Word range — the `wordCount >= 5 && wordCount <= 9` check in `checkRules()`
- Forge pacing — `stepDelay` in `forge()`

And in `styles.css`: the reveal duration lives on `.stage svg.reveal`.

## Credits

Designed and developed under the **DaemonSoftworks** banner by
Euripide Carpio Fajardo · [euripidecarpio.neocities.org](https://euripidecarpio.neocities.org)
