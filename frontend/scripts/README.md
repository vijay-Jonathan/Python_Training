Design-system checks
===================

Run `npm run build`, `npm run test:design`, and `npm run design` for the existing
compiler and generation rules. Run `node scripts/visual-check.mjs` for browser
layout checks. This uses the installed Vite and a local Chrome/Chromium executable;
set `CHROME_PATH` if automatic discovery does not find yours. No browser package
or download is required.

Design tests cover missing, marked custom, and unmarked stub themes; run
`node scripts/theme.test.mjs` for authored, stored, and system theme precedence.

The fixture imports actual kit components and covers six presets, both themes,
320/390/768/1440px widths, all shell layouts, forms, tables, cards, navigation,
keyboard focus, hover feedback and reduced motion. Checks assert containment,
visible navigation, composition and footer alignment. They are geometry/state
regressions, not pixel snapshots. Set `VISUAL_OUTPUT` to a local directory to save
screenshots for manual review. `--capture-only` saves two representative views
without the layout assertions, useful for before/after review.

Run `node scripts/imagery.test.mjs` for deterministic selection, pool diversity,
legacy call signatures, dimensions and local fallback checks. Numeric record IDs
now cycle each curated pool; existing string seeds retain their mapping. For named
collections, `photo(name, {topic, index})` accepts a stable original ordinal. Never
use the current sorted/filtered row position. Pools are finite, so repetition after
exhaustion is expected. These are illustrative topic photos, not exact product images.
No new images or licence changes are introduced; externally searched images still
require the source's credits, and should retain their URLs alongside attribution.

To inspect an already running generated app (development only), set
`VISUAL_BASE_URL=http://127.0.0.1:5100` and `VISUAL_ROUTES` to a JSON array such as
`["/#/", "/#/catalogue", "/#/catalogue/1"]`, then run the same browser script.
Choose 1–6 real routes. It checks each at 390px and 1440px for horizontal overflow,
empty/error rendering, uncaught exceptions, failed image frames, native broken
images and CSS background image failures. Missing images with intentional fallback
labels are reported separately. Image requests have a four-second timeout, so an
offline/slow image host can produce a finding. Screenshots are optional via
`VISUAL_OUTPUT`; inspect them for subject relevance, repetition and cropping.
This is a bounded smoke check, not a full accessibility or visual-diff suite, and
is never invoked by production generation/build/deployment.

Two optional class combinations extend existing compositions:

- `split split-even`: equal columns for paired content, stacked below 60rem.
- `grid grid-featured`: a wide lead card and two supporting cards, stacked below
  60rem. Use for three related items; use the existing auto-fit `grid` for lists.

The fixture is outside `src` and the production entry point, so it is not shipped
in application bundles. Existing props, presets and token names remain unchanged.
