# Squarespace Feasibility

*"Be 100% sure that all this design and structure will be developed via Squarespace."*

Straight answer: **I cannot be 100% certain without building it in EBMA's actual
Squarespace account.** No one can. What follows is what is verified, what is
high confidence, and what is genuinely at risk, so the risk is known rather than
discovered at build time.

Anyone who tells you a design is 100% guaranteed on a platform they have not
built it on is guessing.

---

## What is actually verified

`squarespace/_test/` reproduces Squarespace 7.1's real DOM structure and runs
the generated `custom-css.css` against it. **23/23 assertions pass**, covering:

| Verified | How |
|---|---|
| Marker-div `:has()` scoping | Ink, cream and deep grounds apply to a whole native section |
| Native text blocks become stat tiles | `<h2>` renders as the number, `<p>` as the label |
| Native headings become campaign type | Correct size, weight, leading, and sentence case |
| Hero scrims | Both gradients generate on `.section-background` |
| On-dark accent tints | AA-safe tint applies, not the base colour |
| Native buttons | Pill radius, sentence case, radish ground |
| **Squarespace's own mobile nav** | Burger, overlay, folder items, CTA, 48px targets |
| **Squarespace's own animations** | Neutralised so they cannot fight our reveal |
| Photo grade | Reaches native image blocks |

This is a faithful copy of 7.1's markup, not Squarespace itself. It cannot catch
changes Squarespace makes to their own class names.

---

## Confidence, component by component

### Certain (documented platform features)

| Component | Mechanism |
|---|---|
| Custom CSS, code injection | Business plan feature |
| Section grounds, spacing, type | Custom CSS |
| Utility bar | Announcement Bar |
| Nav with dropdowns | Folders |
| Donate button in header | Header CTA button |
| Hero photo | Section background image |
| Cards, split layouts, index lists | Fluid Engine + Custom CSS |
| Newsletter | Newsletter Block |
| News/Stories | Blog collection |
| Redirects | URL Mappings |

### High confidence (verified in simulation, standard CSS)

- **The marker-div technique.** `:has()` is supported in every current browser
  and inside the editor iframe.
- **Support router, work index, Black Radish feature.** Plain HTML in Code
  Blocks; nothing platform-specific.
- **Partner logo marquee.** Code Block plus the footer script.
- **Scroll reveals and stat counters.** Progressive enhancement; the page is
  complete without them.

### Medium: needs checking in the real account

1. **Squarespace's own CSS is loaded after the theme but specificity fights are
   real.** The kit already uses `!important` where the platform is stubborn.
   Expect a handful more once it is live. This is normal Squarespace work, not a
   design flaw.
2. **Section vertical padding.** Squarespace controls section height in the
   editor and it can fight `--ebma-section-y`. Set section heights in the editor
   first, then adjust.
3. **The fixed header stack.** The prototype wraps the utility bar and header in
   one fixed element. Squarespace keeps them separate and manages stacking
   itself, so use the platform's Fixed Position setting rather than porting the
   wrapper. The kit accounts for this.
4. **Variable font axes.** The wordmark uses Archivo's `wdth` axis. The Design
   panel may not expose it, which is why the header injection loads the axis
   range directly. Verify it renders wide, not condensed.
5. **Code Blocks show as grey placeholders in the editor.** Expected behaviour,
   not a broken paste. It surprises clients.

### Known differences by design, not defects

- **The prototype's header, nav, mobile panel and footer are throwaway.** They
  exist because the prototype has no platform. Squarespace supplies all four
  natively, and the kit restyles the platform's versions. Never port
  `.p-header`, `.p-nav`, `.p-mobile-nav`, `.p-footer` or `.p-topbar`.
  `squarespace/build.sh` excludes them, and a check asserts none leak in.
- **The mobile menu behaves differently.** The prototype builds its own panel;
  Squarespace has its own burger and overlay. The design is matched, the markup
  is not.

### The one real constraint

**A Business plan or higher is required.** Custom CSS and Code Injection do not
exist on Personal. Confirm this before any build work starts. Nothing else in
the kit depends on a plan level.

---

## What would make it certain

The only way to reach certainty is to build it:

1. **Duplicate the site** (Settings, Website, Duplicate Site) and build on the
   copy. Never build on the live site.
2. Paste the CSS and injections, build the homepage, and walk
   `docs/06-launch-qa.md`.
3. Budget for a round of specificity fixes. Every Squarespace build has one.

A homepage build on a duplicate is roughly a day, and it converts every
"medium confidence" line above into a yes or a no. That is the honest route to
100%, and it is worth doing before the remaining pages are designed, so anything
that has to change gets found once rather than seven times.

---

## Anything the design cannot do on Squarespace?

**No.** Reviewing every component against the platform's constraints, nothing in
this design requires capability Squarespace lacks on a Business plan. There is
no custom backend, no build step, no framework, no server rendering, and no
dependency beyond Google Fonts.

The risk is not feasibility. It is the ordinary friction of making a platform's
defaults get out of the way, which is why the kit is biased toward native,
client-editable sections rather than replacing the platform wholesale.
