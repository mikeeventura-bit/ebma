# Content & Assets to Gather

Brief §11. **This is the critical path.** Every other phase can proceed in
parallel; the site cannot launch without photography, and gathering it always
takes longer than expected. Start it first.

Assign one owner (the PHOTOGRAPHY decision in `01-audit.md`).

---

## Photography

The design is built to let real EBMA photography do the storytelling, so the
slots are large and unforgiving — a small, low-resolution phone snap will not
carry a full-bleed hero.

### Specifications

| | Requirement |
|---|---|
| Format | JPEG, sRGB |
| Hero images | **2400px wide minimum** |
| Section images | 1600px wide minimum |
| Card images | 1000px wide minimum |
| File size | Under 500KB after Squarespace processing |
| Orientation | Shoot wide **and** vertical where possible — the layout uses 4:5 and 3:4 crops |

Mixed sources are fine. The design applies a unifying grade and warm wash
precisely so a library shot across several years and a dozen phones still reads
as one system. What it cannot fix is resolution, motion blur, or a subject too
far away.

### Shot list

Every slot in the built homepage, with what it needs:

| Slot | Shot | Priority |
|---|---|---|
| **Hero** | Community members at a market or grocery delivery. Wide, horizontal, faces visible, East Brooklyn context | **Critical** |
| Card 01 | Grocery delivery — volunteer handing bags to a neighbor | High |
| Card 02 | Black Radish — produce crates, branded packaging, market stall | High |
| Card 03 | A New York farmer or producer on their farm | High |
| Card 04 | Youth program — young people working a market or packing session | High |
| Card 05 | Community market — RAMS, produce tables, shoppers | High |
| Black Radish ×2 | Close, saturated produce **and** a customer or market moment | **Critical** |
| Origin story | Archival COVID-era EBMA, 2020–21 — volunteers packing or distributing | **Critical** |
| Partners | Confirmed partner logos, SVG or transparent PNG | Medium |

Also gather, for the remaining pages: Black Yard Farm / Earth Day · CCC
partnership activity · team and leadership portraits · East Brooklyn
neighborhood context · events.

### Permissions

Non-negotiable before anything goes live:

- **Written consent for identifiable people**, especially minors in the youth
  programme. A signed release, not a verbal yes.
- **Photographer credit** where owed.
- If consent for a face cannot be obtained, use the shot only if the person is
  genuinely unidentifiable — not merely turned away.

### Alt text

Every image needs alt text describing **what is happening**, not the filename.
"Volunteers loading grocery bags into a car in Brownsville" — not "IMG_4471" or
"community". This is a legal accessibility requirement and it is also how the
photographs become searchable.

---

## Logo — needed before launch

EBMA's wordmark is ultra-heavy condensed caps, set on two lines optically
justified to the same width. The prototype currently **rebuilds it in a
webfont as a stand-in**, which is not acceptable for production: a wordmark
built from live type reflows if the face fails to load, and will never match
the original letterforms exactly.

- [ ] **Wordmark as SVG** — vector, outlined text (not live type)
- [ ] **Black version** for cream/light grounds
- [ ] **Cream or white version** for the ink header, hero and footer
- [ ] A stacked and, if one exists, a single-line horizontal lockup
- [ ] Favicon / app icon derivation — 512×512 PNG minimum
- [ ] **The typeface name**, if known. The wordmark is the brand's type anchor;
      knowing the face lets the site's display type relate to it rather than
      merely coexist with it.
- [ ] Minimum clear space and minimum size rules, if the org has them

Until the SVG arrives, do not export the CSS stand-in as an image and treat it
as the logo.

## Organizational information

- [ ] Updated mission statement
- [ ] Current programme descriptions — one paragraph each
- [ ] Leadership and team: names, roles, photographs, short bios
- [ ] Confirmed partner list
- [ ] Contact: address, phone `[VERIFY 347.450.4446]`, general email, press email
- [ ] Donation details, once the platform decision is made
- [ ] Legal: EIN `[VERIFY 85-3644732]`, 501(c)(3) status
- [ ] Social accounts currently in use
- [ ] Current service area `[VERIFY: Ocean Hill, Brownsville, East New York, Cypress Hills, Breukelen Houses, Starrett City]`

## Impact statistics

For each figure, capture **the number, the period it covers, and the source.**
A number without a date is what created the problem this refresh is fixing.

- [ ] Youth employed — 2026
- [ ] Grocery deliveries per cycle — current
- [ ] Households served — current
- [ ] Pounds of produce distributed — state the period
- [ ] Farmers and producers supported
- [ ] Markets operated
- [ ] Community partners
- [ ] Neighborhoods served

Public sources cite 1,000,000+ lbs distributed and 100,000+ residents reached.
**Confirm and date these before publishing.** They appear to be cumulative
COVID-era totals; presenting them beside 2026 operating figures would repeat
exactly the confusion the refresh exists to correct.

## Historical material — archive, do not erase

Brief §12: *"Important historical information should be archived rather than
erased."*

- [ ] COVID response numbers and timeline
- [ ] Prior impact reports (PDFs)
- [ ] Press and media coverage, with dates and links
- [ ] Major organizational milestones
- [ ] Founding story details and founding volunteers

This material is the evidence for the story the refresh wants to tell. Give it a
dated home under `/about` or `/impact` rather than deleting it.

---

## Suggested folder structure

```
EBMA-Website-Assets/
  01-hero/
  02-programs/{food-access,black-radish,farmers,youth,markets}/
  03-people/{team,volunteers,community}/
  04-archive-covid/
  05-partners-logos/
  06-documents/{reports,press}/
  CONSENT/                  <- signed releases, filenames matching the photos
  alt-text.csv              <- filename, alt text, photographer, date, consent y/n
```

`alt-text.csv` is worth the ten minutes. It makes the Squarespace upload pass
mechanical instead of a scramble, and it is the record proving consent was
obtained.
