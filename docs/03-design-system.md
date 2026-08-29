# Design System

The visual direction from brief §04, made concrete: **Brooklyn.
Community-driven. Modern. Bold. Warm. Food-centered. Established. Human.**

Source of truth is `prototype/assets/css/tokens.css`. That file is copied
verbatim into the Squarespace Custom CSS — the values below are documentation
of it, not a second definition.

---

## 1. Designing against the generic nonprofit template

The brief asks the site to *"avoid the look of a generic nonprofit template."*
That is only actionable if you name what the template actually looks like:

| The template does this | EBMA does this instead |
|---|---|
| Pale blue / teal / soft gradients | Warm near-black and cream |
| Thin, light-weight headlines | 800–900 weight display type |
| Everything centred | Left-aligned, asymmetric |
| Rounded cards with icon circles, 3-up | Hard edges, full-bleed, photo-led |
| Stock photos of anonymous smiles | Real EBMA photography, credited |
| Type sized to fit politely | Campaign-poster scale |

If a section starts drifting toward the left column, it is off-direction.

---

## 2. Palette

Photography supplies most of the colour. The interface is a restrained frame.

| Token | Hex | Role |
|---|---|---|
| `--ebma-ink` | `#12100E` | Warm near-black. Primary dark ground. |
| `--ebma-ink-soft` | `#2A2622` | Raised surfaces on dark. |
| `--ebma-cream` | `#F7F2E8` | Warm off-white. Primary paper. |
| `--ebma-cream-deep` | `#EDE4D3` | Subtle banding between cream sections. |
| `--ebma-radish` | `#8E1F3C` | Deep radish/burgundy. Primary accent **on cream**. |
| `--ebma-radish-deep` | `#6E1129` | Hover / pressed. |
| `--ebma-green` | `#2F5D3A` | Natural green. Secondary accent. |
| `--ebma-clay` | `#B85C38` | Earth tone. Tertiary, decorative. |
| `--ebma-radish-on-dark` | `#C9455F` | Radish accent **on dark grounds**. |
| `--ebma-clay-on-dark` | `#CE7A50` | Clay accent **on dark grounds**. |

### Why there are on-dark variants

The base radish and clay are tuned for cream paper. On near-black they fail
WCAG AA — radish lands at **2.18:1** and clay at **4.18:1**. Both were caught by
the automated audit, not by eye.

The on-dark tints are calibrated against **`--ebma-ink-soft`, the lightest dark
surface, not the darkest.** A tint that only clears AA on `--ebma-ink` fails
silently the moment it lands on a raised tile — clay at `#C46B45` measured 5.00:1
on ink but **3.96:1** on ink-soft, which is exactly how it regressed when stat
tiles gained a raised surface. Checking the worst case makes the token safe on
every dark ground:

| | on ink | on ink-soft | on ink-deep |
|---|---|---|---|
| `--ebma-clay-on-dark` `#CE7A50` | 5.90 | **4.66** | 6.15 |
| `--ebma-radish-on-dark` `#C9455F` | 4.07 | **3.22** | 4.24 |

`--ebma-radish-on-dark` is for **large display type only** (≥24px); it does not
meet the 4.5:1 small-text threshold on ink-soft.

You never select these by hand. Dark surfaces set `--ebma-accent-campaign` and
`--ebma-accent-eyebrow` in one place in `components.css`, so an accent cannot be
dropped onto a ground it fails against.

### Verified contrast

Every foreground/background pair rendered on the homepage, measured in a real
browser by `verify-contrast` (see §7). **21/21 pass. 0 failures.**

| Pair | Ratio | Needs | |
|---|---|---|---|
| Cream on ink | 17.01 | 4.5 | ✅ |
| Ink on cream | 17.01 | 4.5 | ✅ |
| Cream on ink-deep | 17.73 | 4.5 | ✅ |
| Muted cream `#C9C0B3` on ink | 10.55 | 4.5 | ✅ |
| Cream on radish | 7.80 | 4.5 | ✅ |
| Radish on cream | 7.80 | 4.5 | ✅ |
| Radish on cream-deep | 6.90 | 4.5 | ✅ |
| Muted ink `#58514A` on cream | 6.99 | 4.5 | ✅ |
| Muted ink on cream-deep | 6.18 | 4.5 | ✅ |
| Green on cream | 6.85 | 4.5 | ✅ |
| **Clay-on-dark on ink** | 5.00 | 4.5 | ✅ |
| **Clay-on-dark on ink-deep** | 5.21 | 4.5 | ✅ |
| **Radish-on-dark on ink** (large) | 4.07 | 3.0 | ✅ |

⚠️ **`--ebma-clay` on cream is 4.07:1** — below AA for body text. It is a
decorative tone on light grounds (rules, focus rings, dashes). Never set small
cream-ground text in clay; use `--ebma-radish` (7.80:1).

---

## 3. Typography

**The wordmark is the type anchor.** EBMA's existing logo is ultra-heavy
condensed caps on two lines, justified to equal width. The display face is
chosen to relate to it, not to compete with it — which is also why headings sit
at weight 800 rather than 900: at 900 they start to read as wordmark rather
than as heading.

**Display — Archivo.** A grotesque with a genuine 900 weight and tight
apertures. It holds up at scale, which most Google fonts do not. If the
wordmark's actual typeface can be identified (see the asset checklist), revisit
this — a display face drawn from the same family as the logo would tie the
system together more tightly than Archivo does.

**Body — Inter.** Neutral, highly legible at small sizes, wide language
coverage.

Both are in Squarespace's built-in library. **Set them in Design → Fonts as well
as in the CSS**, so the team can adjust without touching code.

Alternates, if Kelvin wants options:

| | Display | Body | Character |
|---|---|---|---|
| **A (recommended)** | Archivo | Inter | Modern, neutral, workhorse |
| **B** | Anton / Oswald | Public Sans | Louder, more condensed, poster-forward |
| **C** | Archivo | Source Serif 4 | Warmer, more editorial, "established" |

### Scale

All sizes are fluid `clamp()` — poster-huge on desktop, never overflowing a
320px phone.

| Token | Range | Use |
|---|---|---|
| `--ebma-fs-campaign` | 2.5 → 4.5rem (72px) | Hero headline and statements |
| `--ebma-fs-h1` | 2 → 3.25rem (52px) | Page titles |
| `--ebma-fs-h2` | 1.6 → 2.375rem (38px) | Section headings |
| `--ebma-fs-h3` | 1.2 → 1.5rem (24px) | Card and index titles |
| `--ebma-fs-stat` | 2.5 → 4rem (64px) | Stat numbers |
| `--ebma-fs-lead` | 1.075 → 1.375rem | Standfirst |
| `--ebma-fs-body` | 1.0625rem | Body |
| `--ebma-fs-nav` | 1.0625rem (17px) | Navigation |
| `--ebma-fs-eyebrow` | 0.75rem | Tracked-out labels |

**Never set a heading below weight 600.** Weight carries "bold" and
"established"; a light headline reads as the template. Headlines are **800** —
900 paired with all-caps is what read as shouting.

**Nothing may render larger than the hero headline.** Cutting the H1 without
bringing the rest of the scale down would leave the page's largest type on a
statistic — stat numbers were 96px and the Black Radish lockup 88px against a
72px headline. `verify-rules.mjs` asserts this.

### The uppercase rule

**Uppercase belongs on the small tracked label and nowhere else.** Not an H1,
not an H2, not a nav link, not a button.

This is the single most load-bearing rule in the system, and it is drawn from the
agency house style: Premier Gas, Undiscovered Destinations and Tyneside Marketing
all set headlines in sentence case with one accent-coloured word, and reserve
tracked caps for the eyebrow above. Pass 1 set the hero in all-caps at weight 900
and the nav in all-caps at 0.08em tracking — that one decision is what made the
page read as shouting and the menu as loud.

The dividing line is **14px**: uppercase is fine on a label at or below it
(eyebrow, footer column heading, stat note), wrong above it. `verify-rules.mjs`
enforces this by measured font size rather than by class list, so it cannot
regress one section at a time.

**One exception**: `.ebma-campaign--poster`, for a true poster statement
(brief §04), used **at most once per page**. Rarity is the whole point — applied
to three sections in pass 1 it stopped being emphasis and became the default
voice.

### Campaign type

Brief §04: *"Key statements can behave like campaign posters."*

```html
<h1 class="ebma-campaign">
  <span class="ebma-campaign__line">Food. Community.</span>
  <span class="ebma-campaign__line ebma-campaign__accent">Opportunity.</span>
</h1>
```

Rules that make it work:

1. **Every line is its own `<span>`.** A campaign statement never wraps by
   accident — the breaks are a design decision.
2. **Never add a `max-width`** to a campaign block. A character constraint on
   top of explicit breaks re-wraps each line to one word and turns the
   statement into a column. (This happened during the build.)
3. **One accent line per statement**, at most.
4. **Two or three per page, maximum.** Their power is that they are rare.

Sanctioned statements, from the brief:
`FOOD. COMMUNITY. OPPORTUNITY.` · `EAST BROOKLYN FEEDS EAST BROOKLYN.` ·
`BUILDING A STRONGER FOOD SYSTEM.` ·
`WE ARE NOT SIMPLY RESPONDING TO FOOD INSECURITY.`

---

## 4. Photography

Brief §04: real EBMA photography does most of the storytelling.

EBMA's library will arrive from many phones, many events and several years.
Without a unifying treatment that reads as scrappy; with one it reads as
**established** — which is the word in the brief.

- **Grade:** `--ebma-photo-grade` — `saturate(1.04) contrast(1.06)
  brightness(0.98)`, applied to every image including native Squarespace image
  blocks.
- **Warm wash:** `--ebma-photo-warmth` — a 10% clay multiply layer that pulls
  mixed white balances together.
- **Crops:** editorial, never square by default — `--portrait` (4:5),
  `--landscape` (3:2), `--tall` (3:4), `--wide` (16:9).
- **Captions:** real photography earns a credit. Use `.ebma-caption`.

### Scrims

Type sits on photography constantly, so contrast cannot depend on which image
was uploaded.

- `--ebma-scrim-bottom` — carries the hero headline.
- `--ebma-scrim-top` — **guarantees the navigation stays legible.** The header
  is transparent over the hero, so the *top* of the image is what matters. A
  bottom-only scrim leaves the nav to vanish the first time someone uploads a
  bright, sunny market photograph.

Both are applied together on the hero, in the prototype and in Squarespace.

---

## 5. Components

| Class | Purpose |
|---|---|
| `.ebma-campaign` | Poster statement (see above) |
| `.ebma-eyebrow` | Tracked-out label with a rule; every section's entry point |
| `.ebma-btn` + `--primary` `--ghost` `--invert` `--solid-cream` | Buttons. Two levels only — a third invites clutter |
| `.ebma-arrow-link` | Oversized text link with a travelling arrow |
| `.ebma-stats` / `.ebma-stat` | Impact tiles, hairline rules not card borders |
| `.ebma-stat--tbd` | **Visibly provisional metric.** Dashed outline, dimmed. Cannot ship by accident |
| `.ebma-cards` / `.ebma-card` | Photo-led programme cards, capped at 3 columns |
| `.ebma-index` | Editorial index — replaces bullet lists |
| `.ebma-photo` | Graded, cropped image frame |
| `.ebma-reveal` | Scroll-in animation (fail-visible, see §6) |
| `.ebma-router` | Support router — the four §02 paths as labelled rows |

### Geometry

House style is generous: pill buttons, generously rounded cards. Pass 1 used a 2px
radius, justified as "established, not bubbly"; the reference disagrees, and hard
square edges read colder than a brief asking for *warm* and *human*.

| Token | Value | Use |
|---|---|---|
| `--ebma-radius-pill` | `999px` | Every button |
| `--ebma-radius-card` | `14px` | Router rows, stat tiles, dropdowns, form fields |
| `--ebma-radius` | `6px` | Inputs, small surfaces |
| `--ebma-radius-img` | `10px` | Photography |

Photography crops stay near-square so the editorial feel survives.

### Black Radish separation

Brief §07 requires Black Radish to read as *"an initiative of East Brooklyn Mutual
Aid while maintaining its own identity"*, and §10 lists *"Build Black Radish"*
among the things donations fund. So there are two distinct money flows:

```
donor    → EBMA         (donation — funds the mission, incl. building Black Radish)
customer → Black Radish (purchase — low-cost groceries)
```

Blurring them is the failure mode. The rules:

- Black Radish keeps its own ground (`#0B0A09`), clay accent and lockup. EBMA uses
  radish on cream/ink. The palettes never merge.
- Every Black Radish block carries "An initiative of East Brooklyn Mutual Aid".
- Its lockup must never out-scale the EBMA headline above it — that is how a
  sub-brand starts reading as the parent.
- **Never a Donate CTA inside a Black Radish block; never a shop link inside an
  EBMA support block.** `verify-rules.mjs` asserts both.
- Shopping hands off to `blackradishgrocery.com`; the EBMA site never duplicates
  the storefront.

---

## 6. Accessibility

Not a launch checklist item — built into the tokens.

- **Contrast:** every rendered pair verified at AA. See §2.
- **Focus:** 3px clay outline, 3px offset, on everything focusable. Squarespace's
  default focus style is overridden.
- **Motion:** `prefers-reduced-motion` stops the counters, the
  card zooms and the reveals. Verified.
- **Skip link:** first focusable element on every page.
- **Reveals fail visible.** The hiding rule is scoped to `.ebma-js`, which
  `ebma.js` adds *only* after confirming it can animate. No JS, an old browser,
  a blocked script, an observer that never fires — content shows. A 4-second
  safety timer reveals anything still hidden. Verified with JS fully disabled:
  all 24 blocks visible.

  The opposite arrangement — hide in CSS, reveal in JS — can silently blank a
  whole page. On a site whose purpose is telling people how to get food, that
  is the wrong failure mode.
- **Counters** animate to the number already in the DOM, so the real figure is
  always present for screen readers.

---

## 7. Verification

```bash
cd prototype && python3 -m http.server 8099 &
node verify-contrast.mjs      # 21/21 AA pairs
node verify-render.mjs        # 3 widths, overflow + console errors
node verify-fallbacks.mjs     # reduced-motion and no-JS
node verify-rules.mjs         # 6/6 house rules: uppercase, poster rarity,
                              # brand separation, badge, hierarchy, §02 paths
cd ../squarespace && python3 -m http.server 8098 &
node _test/verify.mjs         # 17/17 Squarespace marker checks
```

See `docs/06-launch-qa.md` for the pre-launch pass on the real site.
