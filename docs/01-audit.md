# Phase 1: Site Audit & Decisions

Brief §13 Phase 1: *"Review every existing page and classify it: KEEP / UPDATE /
REMOVE / ARCHIVE / REBUILD."*

---

## 1. Page inventory

The live site could not be crawled from the build environment (the domain is
blocked by the network egress proxy), so this inventory was reconstructed from
search-engine records. **Treat it as a starting point, not a complete list** : 
confirm against the Pages panel in the Squarespace admin, which is the only
authoritative source and will also show unlinked and draft pages.

| URL | Page title as indexed | Proposed | Notes |
|---|---|---|---|
| `/` | East Brooklyn Mutual Aid | **REBUILD** | New homepage: built this pass |
| `/about` | About Us | **REBUILD** | Story, mission, history, leadership |
| `/our-team` | Our Team | **UPDATE** | Fold into About, or keep as a child page |
| `/what-we-do` | **"General 1"** | **REBUILD** | Title is an unedited Squarespace default: becomes Our Work |
| `/blackradish` | Black Radish | **REBUILD** | Flagship destination; hands off to the storefront |
| `/impact` | Our Impact | **REBUILD** | Blocked on which stats are publishable |
| `/donate` | Donate | **REBUILD** | Blocked on the donation-platform decision |
| `/fundraise` | Fundraise | **UPDATE / MERGE** | Likely duplicates `/donate` |
| `/take-action` | Join us | **UPDATE / MERGE** | Becomes Get Involved |
| `/homeold` | **"Home New"** | **REMOVE** | Abandoned draft homepage, publicly reachable |
|, | News / Stories | **NEW** | No equivalent found; brief §05 asks for one |

Two findings worth raising with Kelvin directly:

- **`/homeold` is a live, indexed, abandoned draft homepage** titled "Home New".
  A visitor or search engine can reach a second, stale version of the site.
- **`/what-we-do` is still titled "General 1"**, a Squarespace default that was
  never renamed. It has been indexed under that name.

Both are exactly the "duplicate information" and "old reports presented as
current information" problems named in brief §12.

---

## 2. Classification key

| Label | Means |
|---|---|
| **KEEP** | Accurate today. Leave the content alone; restyle only. |
| **UPDATE** | Right idea, stale content. Rewrite copy, refresh photography and figures. |
| **REMOVE** | Delete the page and redirect the URL. |
| **ARCHIVE** | Historically important, no longer current. Move under `/archive/`, label with its date, keep reachable. |
| **REBUILD** | Rebuild from scratch on the new design system. |

Brief §12 is explicit: *"Important historical information should be archived
rather than erased."* COVID-era numbers, prior impact reports and press coverage
are ARCHIVE, never REMOVE. They are the evidence for the story the refresh wants
to tell, that EBMA responded to a crisis and then stayed.

---

## 3. URL redirect map

Every removed or renamed URL needs a 301, or EBMA loses the search ranking and
inbound links it has built since 2020. Grant applications and press coverage
link to these addresses.

**Where:** Squarespace admin → Settings → Advanced → **URL Mappings**
**Syntax:** `/old-path -> /new-path 301`

```
/what-we-do   -> /our-work      301
/take-action  -> /get-involved  301
/fundraise    -> /donate        301
/homeold      -> /             301
/our-team     -> /about         301
/blackradish  -> /black-radish  301
```

Before finalising: export the full URL list from the Pages panel, and pull
Google Search Console's top-pages report so no linked-to URL is missed. Anything
with inbound links gets a redirect even if it seems obsolete.

---

## 4. Decisions still open: brief §14

These are EBMA's calls, not the designer's. Each carries a recommendation so
the team has something to react to rather than a blank page. **Nothing that
depends on these is assumed silently anywhere in the build.**

| Decision | Recommendation | Blocks |
|---|---|---|
| **Project lead** | One named owner with Squarespace admin access | Everything |
| **Website access** | Confirm who holds the Squarespace login and billing before work starts | Build start |
| **Donation platform** | Support is currently split across GoFundMe, ioby, Cash App and Venmo. Consolidate to **one** primary on-site path, Squarespace donation blocks (Stripe) or a Givebutter embed: with the rest as secondary. Fragmented giving costs conversions and makes impact reporting impossible. | `/donate`, every CTA |
| **Black Radish depth** | A strong story page on the EBMA site; the storefront stays at `blackradishgrocery.com`. Duplicating the shop splits maintenance and confuses the buying journey. | `/black-radish` |
| **EBMA ↔ Black Radish relationship** | **Needs an explicit answer.** Public sources describe "Black Radish Home Delivery" as EBMA's longest-running *programme*; the brief (§07) frames Black Radish as something people *purchase through*. Those are different relationships, and copy that splits the difference will mix the two brands. Extends §14's "How prominently should Black Radish live within the EBMA website?" | `/black-radish`, `/our-work`, all copy |
| **Public food-request process** | Does EBMA have one? If yes, the site needs a clear community-member path. If no, the site should describe programmes and **not** offer a request CTA, a neighbour clicking one and finding nothing is worse than not offering it. Note the brief's §02 actions are all give-side (support, partner, volunteer, donate). | Homepage, `/our-work` |
| **Publishable stats** | Publish only what the team can stand behind. The homepage marks unverified metrics with `.ebma-stat--tbd` so a placeholder cannot ship by accident. | `/impact`, homepage |
| **Photography owner** | One named person to gather and organise the library | Phases 3–4 |
| **Copy owner** | One named writer and one reviewer | Phase 2 |
| **Timeline** | Set the launch date after the photo library is in hand, it is the usual bottleneck | Phase 6 |

### Figures found in public sources: verify before publishing

Search results attribute these to EBMA. **None is confirmed by the
organisation**, and several are COVID-era rather than current:

- 1,000,000+ lbs of food distributed
- 100,000+ residents reached via Black Radish Home Delivery
- 100+ households/week fed (COVID-era)
- Service area: Ocean Hill, Brownsville, East New York, Cypress Hills,
  Breukelen Houses, Starrett City
- EIN 85-3644732
- Phone 347.450.4446

Publishing a number the organisation cannot substantiate is a funder-relations
risk, and mixing a 2021 cumulative figure with 2026 operating figures is exactly
the confusion the refresh exists to fix. Each one needs an explicit yes and a
stated time period before it goes on the site.
