# EBMA Website Refresh

Design and Squarespace build kit for the **East Brooklyn Mutual Aid** website
refresh. Client: Kelvin Taitt. Source brief: *EBMA Website Refresh — Project
Overview*, August 2026.

---

## The problem

The current site still describes the 2020 COVID-emergency chapter of EBMA. The
organisation has moved on — food access, Black Radish, farmer partnerships,
youth employment, community markets, longer-term food infrastructure — and the
site has not.

Brief §01: *"The refresh should tell the larger story: from emergency response
to community food infrastructure."*

## The constraint

**The site stays on Squarespace 7.1 (Business plan or higher).** Not a
preference — EBMA is volunteer-run, and a site the team cannot edit themselves
is a site that goes stale in a year. So:

> **Native, client-editable Squarespace sections wherever possible. Custom code
> only where Squarespace genuinely cannot produce the design.**

---

## What's here

```
docs/
  01-audit.md                   Page-by-page audit, URL redirect map, open decisions
  02-content-and-copy.md        Sitemap and copy deck
  03-design-system.md           Palette, type, photography, components, accessibility
  04-squarespace-build-guide.md Section-by-section build steps in 7.1
  05-assets-checklist.md        Photography and content to gather — the critical path
  06-launch-qa.md               Pre-launch checklist

prototype/                      Static build of the design, for sign-off
  index.html                    Homepage — built in full
  about.html … donate.html      Remaining pages, structure only this pass
  assets/css/                   The design system (three files ship to Squarespace)
  verify-*.mjs                  Contrast, render and fallback checks

squarespace/                    The paste-ready implementation kit
  custom-css.css                GENERATED — paste into Design → Custom CSS
  code-injection-header.html    Paste into Code Injection → Header
  code-injection-footer.html    Paste into Code Injection → Footer
  blocks/                       Code Block snippets, one per custom section
  build.sh                      Regenerates custom-css.css from the shared CSS
  _test/                        Squarespace-markup simulation + assertions
```

---

## Where to start

- **Kelvin / EBMA** → open the prototype homepage, then `docs/01-audit.md` §4
  for the decisions the team needs to make.
- **Whoever builds it** → `docs/04-squarespace-build-guide.md`.
- **Whoever gathers content** → `docs/05-assets-checklist.md`. Start now; it is
  the critical path.

## Run the prototype

```bash
cd prototype && python3 -m http.server 8099
# http://127.0.0.1:8099/index.html
```

## Change the design

Edit `prototype/assets/css/{tokens,components,sections}.css`, then:

```bash
./squarespace/build.sh
```

Those three files are shared verbatim between the prototype and the live site;
the build script is what keeps them from drifting. **Never hand-edit
`squarespace/custom-css.css`** — it is generated.

`prototype/assets/css/prototype-only.css` is the exception: reset, navigation
and footer chrome that Squarespace supplies natively. It never ships.

---

## Verification

```bash
npm i playwright   # Chromium is already present — do NOT run playwright install

cd prototype && python3 -m http.server 8099 &
node verify-contrast.mjs     # 21/21 WCAG AA pairs
node verify-render.mjs       # 1440/768/390 — overflow, console errors, screenshots
node verify-fallbacks.mjs    # prefers-reduced-motion, JS disabled
node verify-rules.mjs        # 6/6 house rules — uppercase, poster rarity,
                             # brand separation, badge, hierarchy, §02 paths

cd ../squarespace && python3 -m http.server 8098 &
node _test/verify.mjs        # 17/17 — Squarespace marker technique
```

Current state: **all passing** — 24/24 contrast pairs, 6/6 house rules, 17/17
Squarespace marker checks. No horizontal overflow at any width, no console
errors, every content block visible with JavaScript fully disabled.

---

## Scope of this pass

Per the agreed plan: **homepage built in full** to lock the visual identity,
plus the complete design system and a build guide covering the remaining pages.
Photography is placeholder throughout — every slot names the shot it needs.

Next: sign-off on the homepage, then About · Our Work · Black Radish · Impact ·
Get Involved · Donate.

## Known limitations

- **The live site could not be crawled** from the build environment (the domain
  is blocked by the network egress proxy). The page inventory in `01-audit.md`
  was reconstructed from search records — confirm it against the Squarespace
  Pages panel, which is authoritative.
- **Statistics are unverified.** Figures found in public sources are marked
  `[VERIFY]` and unconfirmed metrics render visibly provisional so they cannot
  ship by accident.
- **The Squarespace test harness simulates 7.1's markup**, faithfully but not
  perfectly. It cannot catch changes Squarespace makes to its own class names.
  Still walk `docs/06-launch-qa.md` on the real site.
