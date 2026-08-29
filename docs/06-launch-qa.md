# Pre-Launch QA

Brief §13 Phase 5. Work top to bottom on the **duplicated** site, then again on
the live site after applying.

Automated checks live with the code — run those first, they catch the
mechanical failures for free:

```bash
cd prototype   && python3 -m http.server 8099 &
node verify-contrast.mjs        # WCAG AA on every rendered pair
node verify-render.mjs          # 1440/768/390, overflow, console errors
node verify-fallbacks.mjs       # reduced-motion, JS disabled
cd ../squarespace && python3 -m http.server 8098 &
node _test/verify.mjs           # Squarespace marker technique
```

Everything below needs a human on the real site.

---

## Accuracy — the reason this project exists

- [ ] **No COVID-era language describing current operations** in the present tense
- [ ] **Every statistic is verified and dated**; no `.ebma-stat--tbd` remains
- [ ] No 2021 cumulative figure sits beside a 2026 operating figure unlabelled
- [ ] Programme descriptions match what EBMA actually does today
- [ ] Team and leadership current
- [ ] Partner list current and correctly spelled
- [ ] Historical material is archived and **dated**, not deleted
- [ ] Contact details, EIN and 501(c)(3) status correct
- [ ] Service area accurate

## Copy

- [ ] Spelling and grammar, every page
- [ ] Names of people, partners and neighborhoods spelled correctly
- [ ] Consistent capitalisation of **Black Radish** and **East Brooklyn Mutual Aid**
- [ ] "Neighbors", not "beneficiaries" or "clients"
- [ ] No lorem ipsum, no `REPLACE-`, no `[VERIFY]` left anywhere

## Links

- [ ] Every nav item resolves
- [ ] Every button and CTA resolves
- [ ] Footer links resolve
- [ ] External links open correctly (`blackradishgrocery.com`, socials)
- [ ] **All redirects from `01-audit.md` §3 are in place and tested** — visit each old URL
- [ ] No links to deleted pages
- [ ] `/homeold` no longer reachable

## Donations — test with real money

- [ ] Complete a **real donation end to end**, then refund it. Do not launch on a test-mode pass
- [ ] Confirmation email arrives and reads correctly
- [ ] Donation appears in the platform dashboard
- [ ] Receipt shows correct legal name and EIN
- [ ] Recurring giving works, if offered
- [ ] Every Donate CTA reaches the same, correct destination
- [ ] Old donation links redirect

## Forms

- [ ] Newsletter signup delivers to the right list
- [ ] Volunteer form delivers to a monitored inbox — **confirm someone is actually reading it**
- [ ] Contact form delivers
- [ ] Every form shows a confirmation state
- [ ] Storage complies with whatever EBMA tells people it does

## Mobile

Most visitors will be on a phone.

- [ ] Test on a real iPhone and a real Android, not just the browser emulator
- [ ] No horizontal scrolling anywhere
- [ ] Campaign headlines break sensibly at 320px
- [ ] Hero legible; navigation reachable
- [ ] Tap targets at least 44×44px
- [ ] Forms usable with an on-screen keyboard
- [ ] Photographs not awkwardly cropped

## Photography

- [ ] Every placeholder replaced
- [ ] **Every image has descriptive alt text**
- [ ] Consent on file for every identifiable person, minors especially
- [ ] Photographer credits where owed
- [ ] Nothing pixelated or stretched
- [ ] Nothing visibly outdated presented as current

## Accessibility

- [ ] Tab through every page — focus always visible, order logical
- [ ] Skip link works
- [ ] Site fully navigable by keyboard alone
- [ ] Headings in order (one H1, no skipped levels)
- [ ] Test with reduced motion on — counters and scroll reveals static
- [ ] Screen-reader pass on the homepage and Donate at minimum
- [ ] Zoom to 200% — nothing lost or overlapping

## Performance

- [ ] Homepage under ~3s on 4G
- [ ] Images compressed; hero under 500KB
- [ ] Lighthouse ≥ 90 performance, ≥ 95 accessibility
- [ ] Test on a mid-range Android, not just a fast laptop

## SEO & metadata

- [ ] Unique title and meta description per page
- [ ] Social sharing image set — check how a shared link previews
- [ ] `/what-we-do` no longer titled "General 1"
- [ ] Sitemap submitted to Google Search Console
- [ ] Favicon set

## Browsers

- [ ] Chrome, Safari, Firefox, Edge — desktop
- [ ] Safari iOS, Chrome Android
- [ ] Confirm `:has()` support: all current browsers. If a funder is on a
      genuinely old browser, sections lose their custom styling but stay
      readable — content never disappears

---

## Launch — brief §13 Phase 6

- [ ] Final backup of the current live site
- [ ] Apply the rebuild
- [ ] Re-test donations **on the live domain**
- [ ] Re-test redirects on the live domain
- [ ] Announce: EBMA and Black Radish email lists, social, partners, supporters

## Week one after launch

- [ ] Watch Search Console for 404s — a missed redirect shows up here
- [ ] Confirm donations are arriving
- [ ] Confirm form submissions are arriving and being read
- [ ] Collect team feedback
- [ ] Book a 30-day content review so the site does not start going stale again
