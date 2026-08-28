# Prototype

A standalone static build of the redesigned site, for sign-off before anything
touches EBMA's live Squarespace account.

`index.html` is the homepage, built in full. The other pages carry the shared
header, footer and type system so navigation resolves and the system can be
seen in context; their sections are specified in `docs/02-content-and-copy.md`
and get built in the next pass.

## Run it

```bash
python3 -m http.server 8099 --directory .
# http://127.0.0.1:8099/index.html
```

## Verify it

```bash
npm i playwright     # Chromium is already present — do NOT run playwright install
node verify-contrast.mjs    # every rendered fg/bg pair against WCAG AA
node verify-render.mjs      # 1440 / 768 / 390, overflow + console errors + screenshots
node verify-fallbacks.mjs   # prefers-reduced-motion, and JS fully disabled
```

Each exits non-zero on failure. Current state: **21/21 contrast pairs pass, no
horizontal overflow at any width, no console errors, all content visible with
JS disabled.**

## CSS layering

| File | Ships to Squarespace? |
|---|---|
| `assets/css/tokens.css` | **Yes** — verbatim |
| `assets/css/components.css` | **Yes** — verbatim |
| `assets/css/sections.css` | **Yes** — verbatim |
| `assets/css/prototype-only.css` | **No** — reset, nav and footer chrome Squarespace supplies natively |

Edit the shared three, then run `../squarespace/build.sh` to regenerate the
paste-ready `squarespace/custom-css.css`. That is what keeps the prototype and
the live site from drifting apart. Never hand-edit the generated file.

## Fonts

The pages load Archivo and Inter from Google Fonts. In a network-restricted
environment they fall back to Helvetica/Liberation Sans — layout and hierarchy
are unaffected, but the campaign type will not show its true 900 weight. The
published artifact renders with the real faces.

## Placeholders

Every image slot is a labelled placeholder naming the shot the brief calls for.
They are deliberately loud: nothing here should be mistaken for a finished page.
See `docs/05-assets-checklist.md`.
