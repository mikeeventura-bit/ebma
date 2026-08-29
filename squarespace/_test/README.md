# Squarespace kit test harness

`sqsp-sim.html` reproduces Squarespace 7.1's DOM structure, `.page-section`,
`.content-wrapper`, `.fluid-engine`, `.sqs-block-*`, `.section-background` : 
and loads the generated `custom-css.css` against it.

It exists because the marker-div technique is the load-bearing idea in this
kit, and "it should work" is not the same as "it does". The harness proves the
`:has()` scoping, the native-block promotion, the hero scrims and the button
overrides all actually match Squarespace's markup, before anyone pastes CSS
into a live client site.

## Run it

```bash
npm i playwright                      # browser already present, see below
cd squarespace && python3 -m http.server 8098 &
node _test/verify.mjs
```

Chromium ships with this environment at `/opt/pw-browsers/chromium` and
`verify.mjs` points at it directly: do not run `playwright install`.

Expected: `17/17 passed`.

## What it does not cover

The fixture is a faithful copy of 7.1's structure, not Squarespace itself.
It cannot catch changes Squarespace makes to its own class names, and it does
not exercise the editor. After pasting into the real site, still walk
`docs/06-launch-qa.md`.
