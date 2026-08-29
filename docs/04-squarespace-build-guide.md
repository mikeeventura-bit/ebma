# Squarespace 7.1 Build Guide

How to build the design in EBMA's Squarespace account. Assumes **7.1 on a
Business plan or higher** — Custom CSS and Code Injection are not available on
Personal.

---

## The governing principle

> **Native, client-editable sections wherever possible. Custom code only where
> Squarespace genuinely cannot produce the design.**

EBMA is volunteer-run. A beautiful site the team cannot update is a failed
redesign — it goes stale in a year and we are back where the brief started.
Every choice below is biased toward the team being able to change words,
numbers and photographs themselves, in the normal editor, without help.

---

## Step 0 — Before touching anything

1. **Confirm the plan.** Design → Custom CSS must exist. If not, the site is on
   Personal and needs upgrading before any of this works.
2. **Duplicate the site.** Settings → Website → Duplicate Site. Build on the
   duplicate, review, then apply to the live site. Never build live.
3. **Confirm admin access** — the WEBSITE ACCESS decision in `01-audit.md`.
4. **Screenshot the current site**, every page, full length. The audit needs a
   record and there is no undo for deleted pages.

---

## Step 1 — Paste the foundations

| What | Where | File |
|---|---|---|
| Custom CSS | Design → Custom CSS | `squarespace/custom-css.css` |
| Header injection | Settings → Advanced → Code Injection → **Header** | `squarespace/code-injection-header.html` |
| Footer injection | Settings → Advanced → Code Injection → **Footer** | `squarespace/code-injection-footer.html` |

Then Design → Fonts: set the heading font to **Archivo** and the body font to
**Inter**, matching the CSS. Doing this natively as well as in CSS is what lets
the team adjust type later without a developer.

---

## Step 2 — The marker-div technique

Squarespace 7.1 gives no way to put a class on a native section. So:

1. Add a **Code Block** to the section containing only its marker:
   ```html
   <div class="ebma-mark ebma-mark--ink ebma-mark--stats"></div>
   ```
2. The Custom CSS scopes the whole section off it with `:has()`.

The section is then custom-designed while its **content stays fully editable in
the normal editor**. This is the load-bearing idea in the kit.

Available markers — full list in `squarespace/blocks/00-markers.html`:

| Marker | Effect |
|---|---|
| `ebma-mark--ink` | Warm near-black ground, inverted text, AA accent tints |
| `ebma-mark--cream` | Warm off-white ground |
| `ebma-mark--deep` | Deeper cream, for banding between two cream sections |
| `ebma-mark--hero` | Adds the top **and** bottom scrims to the section background |
| `ebma-mark--campaign` | Native H1/H2 render as campaign type |
| `ebma-mark--stats` | Native H2 = stat number, native paragraph = label |

Combine freely on one marker div.

> **Verified.** `squarespace/_test/` reproduces real 7.1 markup and asserts all
> of this against the generated CSS — **17/17 passing**. `:has()` is supported
> in all current browsers and inside the Squarespace editor iframe.

> **Expected oddity:** Code Blocks render as a grey placeholder *inside the
> editor* and only appear correctly on the live site or in Preview. That is
> normal Squarespace behaviour, not a broken paste. Tell Kelvin before he sees
> it and panics.

---

## Step 3 — Build the homepage

Section by section. `[N]` = native and client-editable. `[C]` = Code Block.

| # | Section | How | Source |
|---|---|---|---|
| 1 | **Hero** | `[C]` — blank section, hero photo as section background | `blocks/01-hero.html` + `--hero` marker |
| 2 | **Impact at a glance** | `[N]` preferred — `--ink --stats` marker, one Text Block per stat (number as H2, label as paragraph) | `blocks/03-impact-stats.html` |
| 3 | **Positioning statement** | `[C]` | `blocks/04-campaign-statement.html` |
| 4 | **What we do** | `[N]` — Fluid Engine, 5 image+text cards, styled by the CSS | — |
| 5 | **Black Radish** | `[C]` — needs the two-image offset pair | `blocks/05-black-radish-feature.html` |
| 6 | **Origin story** | `[N]` — two-column image + text | — |
| 7 | **2026: work happening now** | `[C]` — `--ink` marker | `blocks/06-work-index.html` |
| 8 | **Where we are going** | `[C]` — the page's ONE poster statement | `blocks/04-campaign-statement.html` + `--poster` |
| 9 | **Support router** | `[C]` — the four §02 paths | `blocks/08-support-router.html` |
| 10 | **Partners** | `[N]` — `--deep` marker, logo grid | — |
| 11 | **Newsletter** | `[N]` — Squarespace Newsletter Block, inherits button styling | — |

Sections 2, 4, 6, 10 and 11 — the ones that change most often — are all native.
That is deliberate.

### Utility bar

Marketing → **Announcement Bar**. Turn it on and the Custom CSS styles it. It
carries the phone number, 501(c)(3) status and the Black Radish storefront link.

Put the storefront link here rather than in the main nav: in the utility bar it
reads as a **separate destination**, which is exactly what it is.

### Header

Design → Header:
- Logo left, navigation right, Donate as a **button** (it renders as a solid
  radish pill — it is the primary action on the site, so never an outline)
- Enable **Fixed position**
- Enable the transparent/overlay option so it sits over the hero
- Build About / Our work / Get involved as **folders** so they get dropdowns;
  Black Radish stays a single page at the top level

**Set the nav to sentence case.** If the style pack forces caps, the Custom CSS
overrides it — but set it correctly in the panel too so the team sees the right
thing while editing.

The CSS handles the transparent → solid transition on scroll, and the hero's
top scrim keeps the nav legible over any photograph.

---

## Step 4 — The remaining pages

Build these after the homepage is signed off, so the visual identity is settled
first (brief §13, Phase 3 → Phase 4). Structure and copy: `02-content-and-copy.md`.

About · Our Work · Black Radish · Impact · News/Stories · Get Involved · Donate

**News/Stories should be a Squarespace Blog collection**, not static pages — it
is the one part of the site meant to change weekly, and a blog gives the team
categories, RSS and an archive for free.

---

## Step 5 — Redirects

Settings → Advanced → **URL Mappings**. The full map is in `01-audit.md` §3.
Do not skip this: EBMA has inbound links from funders and press going back to
2020.

---

## Editing rules for the team

Worth pasting into a note for whoever maintains the site:

- **Campaign statements**: each line is its own `<span class="ebma-campaign__line">`.
  To re-break a headline, change the spans — never let it wrap on its own, and
  never add a width to it.
- **Accent colours are automatic.** Don't hard-code a colour on an accent; the
  system picks the tint that passes contrast on that ground.
- **Unverified numbers** keep `class="ebma-stat--tbd"` until signed off. It
  renders them visibly provisional so they cannot ship by accident.
- **Photographs** need alt text describing what is happening, not "image1.jpg".
- **Two or three campaign statements per page, maximum.**

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Section styling missing | Marker Code Block absent, or the class is misspelled |
| Code Block shows a grey box | Normal in the editor. Check Preview or the live site |
| Custom CSS panel absent | Site is on Personal — needs Business or higher |
| Counters don't animate | Footer injection missing, or reduced-motion is on (correct behaviour) |
| Marquee doesn't scroll | Footer injection missing — it duplicates the track |
| Nav unreadable over hero | Hero section is missing the `--hero` marker, so it has no top scrim |


---

## House rules

Four rules carry most of the design. Breaking any one of them is what makes the
site drift back toward a generic template.

### 1. Uppercase is for small labels only

Not an H1, not an H2, not a nav link, not a button. The dividing line is **14px**:
caps are fine at or below it (eyebrow, footer column heading, stat note), wrong
above it. Headlines are sentence case with **one** accent-coloured word.

One exception: `.ebma-campaign--poster`, **at most once per page**.

### 2. Nothing renders larger than the hero headline

If you scale a stat or a lockup up, the page's biggest type stops being the
headline. `prototype/verify-rules.mjs` asserts this.

### 3. Keep EBMA and Black Radish separate

```
donor    → EBMA         donation, funds the mission — including building Black Radish
customer → Black Radish purchase, low-cost groceries
```

- Every Black Radish block carries "An initiative of East Brooklyn Mutual Aid".
- **Never** a Donate CTA inside a Black Radish block.
- **Never** a shop link inside an EBMA support block — it belongs in the utility bar.
- The Black Radish lockup never out-scales the EBMA headline above it.

### 4. The four §02 paths stay reachable

Volunteer, Partner with us, Ways to give and Donate must all be one hover or tap
from any page. If the nav is restructured, check them.

Run `node prototype/verify-rules.mjs` after any change — it checks all four.
