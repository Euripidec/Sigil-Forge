/* =========================================================
   1. DISTILLATION
   ========================================================= */
const VOWELS = "AEIOU";

function distill(text) {
  const upper = text.toUpperCase();
  const seen = new Set();
  const kept = [];
  const chars = [];
  for (const ch of upper) {
    if (!/[A-Z]/.test(ch)) { chars.push({ ch, status: "plain" }); continue; }
    if (VOWELS.includes(ch) || seen.has(ch)) {
      chars.push({ ch, status: "cut" });
    } else {
      seen.add(ch);
      kept.push(ch);
      chars.push({ ch, status: "keep" });
    }
  }
  return { kept, chars };
}

/* =========================================================
   2. THE FOUR RULES (+ bonus)
   ========================================================= */
const TENSE_MARKERS = ["WILL", "SHALL", "GONNA", "WAS", "WERE",
                       "WANTED", "WISHED", "YESTERDAY", "TOMORROW", "SOMEDAY"];
const NEGATIVE_WORDS = ["NO", "NOT", "NEVER", "DONT", "DON'T", "CANT", "CAN'T",
                        "WONT", "WON'T", "WITHOUT", "STOP", "QUIT", "FEAR",
                        "FAIL", "FAILS", "FAILURE", "HATE", "PAIN", "LOSE",
                        "LOSS", "NOTHING", "NONE", "BAD", "AVOID"];

function checkRules(text) {
  const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const wordSet = new Set(words.map(w => w.replace(/[^A-Z']/g, "")));
  const tenseHit    = TENSE_MARKERS.some(w => wordSet.has(w));
  const iWantHit    = /\bI\s+WANT\b/i.test(text);
  const wordCount   = words.length;
  const wordsOk     = wordCount >= 5 && wordCount <= 9;
  const negativeHit = NEGATIVE_WORDS.some(w => wordSet.has(w));
  return {
    tense: !tenseHit, want: !iWantHit, words: wordsOk,
    negative: !negativeHit, wordCount,
    blocked: tenseHit || iWantHit || !wordsOk || wordCount === 0
  };
}

/* =========================================================
   3. HELPERS
   The letters INFLUENCE the sigil (they decide which motifs
   appear, in what order, and how heavy the mark grows) —
   but arrangement is chance, fresh on every forging.
   ========================================================= */
const between = (r, a, b) => a + r() * (b - a);

/* =========================================================
   4. THE BASHEMOTH / CIRCUIT VOCABULARY
   ViewBox 160x160. Octagon shackle, baseline, spine, crown.
   All straight traces ending in dots — solder pads on a
   circuit board.
   ========================================================= */
const C = 80;
const SPINE_X = 80;
const INK = "#e8e4d8";

const ln  = (x1, y1, x2, y2, sw = 2) =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
const dot = (x, y, r = 2.6) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${INK}"/>`;
const ringEl = (x, y, r, sw = 1.8) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${sw}"/>`;
const poly = (pts, close = false, sw = 2) =>
  `<path d="M ${pts.map(p => p.map(n => n.toFixed(1)).join(" ")).join(" L ")}${close ? " Z" : ""}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;

/* Each motif: (y slot, side, scale, rng) -> svg */
const MOTIFS = {
  crossbar(y, side, s) {
    const w = 13 * s;
    return ln(SPINE_X - w, y, SPINE_X + w, y) + dot(SPINE_X - w, y) + dot(SPINE_X + w, y);
  },
  branchUp(y, side, s) {
    const ox = 15 * s * side, oy = 11 * s;
    return poly([[SPINE_X, y], [SPINE_X + ox, y - oy], [SPINE_X + ox, y - oy - 7 * s]]) +
           dot(SPINE_X + ox, y - oy - 10 * s);
  },
  branchDown(y, side, s) {
    const ox = 15 * s * side, oy = 11 * s;
    return poly([[SPINE_X, y], [SPINE_X + ox, y + oy], [SPINE_X + ox + 6 * s * side, y + oy]]) +
           dot(SPINE_X + ox + 9 * s * side, y + oy);
  },
  diamond(y, side, s) {
    const d = 8.5 * s;
    return poly([[SPINE_X, y - d], [SPINE_X + d, y], [SPINE_X, y + d], [SPINE_X - d, y]], true);
  },
  cross(y, side, s) {
    const d = 8 * s;
    return ln(SPINE_X - d, y - d, SPINE_X + d, y + d) +
           ln(SPINE_X - d, y + d, SPINE_X + d, y - d);
  },
  slash(y, side, s) {
    const d = 9 * s;
    return ln(SPINE_X - d, y + d * side, SPINE_X + d, y - d * side) +
           dot(SPINE_X + d, y - d * side, 2.2);
  },
  chevUp(y, side, s) {
    const w = 11 * s, h = 8 * s;
    return poly([[SPINE_X - w, y + h], [SPINE_X, y - h], [SPINE_X + w, y + h]]) +
           dot(SPINE_X - w, y + h, 2.2) + dot(SPINE_X + w, y + h, 2.2);
  },
  fork(y, side, s) {
    const w = 8 * s, h = 11 * s;
    return ln(SPINE_X, y, SPINE_X - w, y - h) + ln(SPINE_X, y, SPINE_X + w, y - h) +
           dot(SPINE_X - w, y - h - 2, 2.2) + dot(SPINE_X + w, y - h - 2, 2.2);
  },
  stub(y, side, s, r) {           // circuit trace: out, elbow, pad
    const w = 12 * s * side;
    if (r && r() > 0.5) {
      const el = 6 * s * (r() > 0.5 ? -1 : 1);
      return poly([[SPINE_X, y], [SPINE_X + w, y], [SPINE_X + w, y + el]]) +
             dot(SPINE_X + w, y + el + 3 * Math.sign(el));
    }
    return ln(SPINE_X, y, SPINE_X + w, y) + dot(SPINE_X + w + 3 * side, y);
  },
  zigzag(y, side, s) {
    const u = 6.5 * s * side;
    return poly([[SPINE_X, y], [SPINE_X + u, y - 5 * s], [SPINE_X + u * 0.4, y - 9 * s],
                 [SPINE_X + u * 1.5, y - 14 * s]]) +
           dot(SPINE_X + u * 1.5, y - 16 * s, 2.2);
  },
  dotpair(y, side, s) {
    return dot(SPINE_X - 6 * s, y, 2.2) + dot(SPINE_X + 6 * s, y, 2.2);
  },
  cup(y, side, s) {
    const w = 9 * s, h = 8 * s;
    return poly([[SPINE_X - w, y - h], [SPINE_X - w, y], [SPINE_X + w, y], [SPINE_X + w, y - h]]);
  }
};

const LETTER_MOTIF = {
  A: "chevUp",  B: "stub",     C: "stub",    D: "diamond", E: "crossbar",
  F: "crossbar",G: "diamond",  H: "crossbar",I: "dotpair", J: "branchDown",
  K: "branchUp",L: "stub",     M: "chevUp",  N: "slash",   O: "diamond",
  P: "stub",    Q: "diamond",  R: "branchDown", S: "zigzag", T: "crossbar",
  U: "cup",     V: "chevUp",   W: "chevUp",  X: "cross",   Y: "fork",
  Z: "zigzag"
};

function octagon(radius) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 8) + i * (Math.PI / 4) - Math.PI / 2;
    pts.push([C + radius * Math.cos(a), C + radius * Math.sin(a)]);
  }
  return `<path d="M ${pts.map(p => p.map(n => n.toFixed(1)).join(" ")).join(" L ")} Z" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
}

/* =========================================================
   5. BUILDING THE SIGIL
   Letter influence (constant per sentence):
     - which motifs appear, and in what order
     - letter count -> feet / arms / crowding
   Chance (fresh per forging):
     - skeleton proportions, sides, scales, jitter,
       elbow variants, crown size
   ========================================================= */
function buildSigil(letters) {
  const r = Math.random;
  const parts = [];

  // skeleton proportions breathe a little on each forging
  const baseHalf = between(r, 28, 34);            // baseline half-width
  const baseY    = between(r, 106, 110);
  const crownY   = between(r, 43, 49);
  const bx1 = SPINE_X - baseHalf, bx2 = SPINE_X + baseHalf;

  parts.push(ln(bx1, baseY, bx2, baseY, 2.4));
  parts.push(dot(bx1, baseY, 3), dot(bx2, baseY, 3));
  parts.push(ln(SPINE_X, baseY, SPINE_X, crownY, 2.4));
  parts.push(ringEl(SPINE_X, crownY - 6, between(r, 3.4, 5), 2.2));

  // one motif per letter, top-to-bottom; arrangement is chance
  const n = letters.length;
  const top = crownY + 9, bottom = baseY - 8;
  const crowd = Math.min(1, 6 / Math.max(n, 1));
  let lastSide = r() > 0.5 ? 1 : -1;
  letters.forEach((letter, i) => {
    const y = n === 1 ? (top + bottom) / 2 : top + (i * (bottom - top)) / (n - 1);
    lastSide = r() > 0.25 ? -lastSide : lastSide;   // mostly alternate, sometimes repeat
    const s = between(r, 0.8, 1.15) * (0.7 + 0.3 * crowd);
    const jitterY = between(r, -2.5, 2.5);
    const fn = MOTIFS[LETTER_MOTIF[letter] || "stub"];
    parts.push(fn(y + jitterY, lastSide, s, r));
  });

  // heavier intents grow feet and arms (letter-count influence)
  if (n >= 5) {
    const fw = between(r, 15, 20), fh = between(r, 9, 13);
    parts.push(poly([[SPINE_X - fw, baseY + fh], [SPINE_X, baseY + 3], [SPINE_X + fw, baseY + fh]]));
    parts.push(dot(SPINE_X - fw, baseY + fh, 2.4), dot(SPINE_X + fw, baseY + fh, 2.4));
  }
  if (n >= 7) {
    const ax = between(r, 7, 10), ay1 = between(r, 14, 18), ay2 = between(r, 32, 37);
    parts.push(poly([[bx1, baseY], [bx1 - ax, baseY - ay1], [bx1 + 2, baseY - ay2]]));
    parts.push(dot(bx1 + 3, baseY - ay2 - 3, 2.6));
    parts.push(poly([[bx2, baseY], [bx2 + ax, baseY - ay1], [bx2 - 2, baseY - ay2]]));
    parts.push(dot(bx2 - 3, baseY - ay2 - 3, 2.6));
  }

  return [
    `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">`,
    `<rect width="160" height="160" fill="#0d0d0f"/>`,
    octagon(56),
    parts.join("\n"),
    `</svg>`
  ].join("\n");
}

/* === DOM ================================================= */
const els = {
  intent:    document.getElementById("intent"),
  distilled: document.getElementById("distilled"),
  stage:     document.getElementById("stage"),
  redraw:    document.getElementById("btn-redraw"),
  download:  document.getElementById("btn-download"),
  copy:      document.getElementById("btn-copy"),
  wordCount: document.getElementById("word-count"),
  rules: {
    tense:    document.getElementById("rule-tense"),
    want:     document.getElementById("rule-want"),
    words:    document.getElementById("rule-words"),
    negative: document.getElementById("rule-negative")
  }
};

let currentSVG = "";
let forgeToken = 0;
let typeTimer = null;

function setRule(li, ok, warnOnly) {
  li.classList.remove("pass", "fail", "warn");
  li.classList.add(ok ? "pass" : (warnOnly ? "warn" : "fail"));
  li.querySelector(".mark").textContent = ok ? "[OK]" : (warnOnly ? "[~~]" : "[!!]");
}

function renderDistilled(chars) {
  els.distilled.innerHTML = chars.map(({ ch, status }) => {
    const safe = ch.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (status === "plain") return safe;
    return `<span class="${status}">${safe}</span>`;
  }).join("");
}

function validate() {
  const text = els.intent.value;
  const report = checkRules(text);
  const { kept, chars } = distill(text);

  renderDistilled(chars);
  setRule(els.rules.tense, report.tense, false);
  setRule(els.rules.want, report.want, false);
  setRule(els.rules.words, report.words, false);
  setRule(els.rules.negative, report.negative, true);
  els.wordCount.textContent = `${report.wordCount} word${report.wordCount === 1 ? "" : "s"} — aim for 5 to 9`;

  const blocked = report.blocked || kept.length === 0;
  [els.redraw, els.download, els.copy].forEach(b => (b.disabled = blocked));
  return { blocked, kept };
}

/* the 0.5–1s ritual, then a soft fade-in */
function forge(kept) {
  const token = ++forgeToken;
  const lines = [
    "distilling intent",
    `binding ${kept.length} letter${kept.length === 1 ? "" : "s"}`,
    "casting the mark"
  ];
  els.stage.innerHTML = `<div class="forge-log"></div>`;
  const log = els.stage.querySelector(".forge-log");
  const stepDelay = 150 + Math.random() * 70;

  lines.forEach((line, i) => {
    setTimeout(() => {
      if (token !== forgeToken) return;
      log.insertAdjacentHTML("beforeend", `<p>${line}</p>`);
    }, i * stepDelay);
  });

  setTimeout(() => {
    if (token !== forgeToken) return;
    log.classList.add("fade-out");            // dissolve the log first…
    setTimeout(() => {
      if (token !== forgeToken) return;
      currentSVG = buildSigil(kept);          // …then materialize the mark
      els.stage.innerHTML = currentSVG;
      els.stage.querySelector("svg").classList.add("reveal");
    }, 300);
  }, lines.length * stepDelay + 120);
}

function requestForge() {
  const { blocked, kept } = validate();
  if (blocked) {
    forgeToken++;
    currentSVG = "";
    els.stage.innerHTML = `<p class="blocked-msg">the mark waits until your intent honors the rules</p>`;
    return;
  }
  forge(kept);
}

els.intent.addEventListener("input", () => {
  validate();
  clearTimeout(typeTimer);
  typeTimer = setTimeout(requestForge, 400);
});
els.redraw.addEventListener("click", requestForge);

els.download.addEventListener("click", () => {
  if (!currentSVG) return;
  const blob = new Blob([currentSVG], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = els.intent.value.trim().toLowerCase()
                 .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sigil";
  a.href = url;
  a.download = `sigil-${slug}.svg`;
  a.click();
  URL.revokeObjectURL(url);
});

els.copy.addEventListener("click", async () => {
  if (!currentSVG) return;
  try {
    await navigator.clipboard.writeText(currentSVG);
    els.copy.textContent = "copied_";
  } catch {
    els.copy.textContent = "copy failed";
  }
  setTimeout(() => (els.copy.textContent = "copy svg"), 1400);
});

requestForge();
