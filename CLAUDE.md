# Deep Dives — Project Guide

A multi-page site in the design language of Rigged Before the Vote. Each page is one story taken
all the way down: the sequence of events, what was claimed set against what the record shows, who
objected and who defended it, the precedent, and what happens next. Part of the politiboop
workspace (see the workspace `CLAUDE.md` one level up for git identity, validation protocols and
the batch workflow).

"Deep Dives" is a working name. The wordmark lives in `src/layouts/Base.astro`.

## Architecture

- **Astro 6**, static output, the Vercel adapter for web analytics (as on election-rigging).
- **One data file and one page per dive.** `src/data/<slug>.json` holds everything a dive says;
  `src/pages/<slug>.astro` renders it. `src/data/dives.json` is the registry the front door
  (`src/pages/index.astro`) lists, newest first.
- **Shared pieces:** `src/layouts/Base.astro` (fonts, analytics, topbar, footer),
  `src/components/Sources.astro` (a row of source links labeled by outlet),
  `src/lib/fmt.js` (dates, outlet labels, source counts), `src/styles/global.css`.
- **The stylesheet is election-rigging's, copied, with additions below a marked line.** Keep the
  shared half in step with that repo when either changes. The additions deliberately override a
  few shared values rather than editing the shared half: several small mono sizes and the purple
  take block. (The shared `--text-3` was lightened in both repos on 2026-09-24 to clear the 4.5:1
  contrast floor for small text.)
- **Quotes are curly on the page and straight in the data.** `smartAll()` in `src/lib/fmt.js`
  converts every data string except identifiers, dates and `sources` (whose headlines are matched
  as written). Type curly quotes and apostrophes directly in template prose.
- **Every number on a page is computed from its data file.** Never hardcode a count the data can
  produce. The figures are rendered into the HTML; the count-up animation is decoration and only
  runs when the page is visible, so a hidden or scriptless reader still sees the right numbers.

```bash
npm run dev      # or the "deep-dives-dev" preview entry (port 4324)
npm run build    # static output lands in .vercel/output/static
npm run verify   # the integrity check below
```

The workspace `.claude/launch.json` also has `deep-dives-static` (port 4325), which serves the
production build. Test against that when behavior matters: the dev server occasionally serves
stale "Outdated Optimize Dep" 504s after dependencies change, which do not happen in production.
`rm -rf node_modules/.vite` clears them.

## The data model

A dive file (`src/data/press-ban.json` is the reference):

```
slug, updated, trackerIds          the seed entries every source and quote must trace to
meta        kicker, title, dek, status (one line, shown under the headline), statusText (the
            paragraph under "Where it stands"), and the dates the page computes from.
            `orderEnds` is optional: while present it drives the topbar chip and the countdown
            stat; remove it when the order is replaced and both disappear.
hero        deck (paragraphs), quote { lead, text, cite, sources }
days        [{ date, events: [{ time?, actor, title, body[], sources[] }] }]
claims      [{ claim, who, found, detail, sources[] }]   "paraphrased" in `who` renders unquoted
voices      { objected: [...], defended: [...] }  each { who, role, quote, sources[] }
amici       { lead[], names[], highlight, sources[] }    optional, press-ban specific
precedent   [{ year, name, court, holding, sources[] }]
watch       [{ date?, when, title, text, sources? }]
take        [paragraphs]                                  the ONLY place for our opinion
corrections [{ date, text }]
```

`actor` is one of `wh` (the administration), `court`, `press`, `congress`. The label text always
renders next to the color. Any item may carry its own `trackerIds` to narrow what it traces to.

## The three hard rules

1. **Fact/take separation is the product.** Our opinion goes only in `take`, which renders under
   "Our take — opinion, not reporting." Everything else is sourced reporting.
2. **Anti-fabrication.** Every dive is built from verified `controversial-trump` tracker entries.
   Never type a URL. Pull each source from the seed entry's `sources` by exact match.
3. **Quotations are verbatim.** Every quoted passage must match its source word for word. Mark
   omissions with an ellipsis, alterations with brackets, and never splice two sentences that the
   source separates, even by a citation.

## Integrity check

```bash
node verify-sources.js
```

Enforces rules 2 and 3 mechanically, for every dive in `dives.json`:

- every source URL must appear in the sources of a seed entry (`trackerIds`);
- every double-quoted passage of two words or more, in the data and in the page template, and
  every `quote` field, must appear verbatim in a seed entry's text (summary, keyFacts, headlines);
- every item that states facts must carry sources.

It normalizes only what is typography (curly vs straight quotes, dash forms and spacing, ellipses,
invisible joiners, bracketed capitals like `[N]othing`), never wording. It exits non-zero on any
failure. Run it on every change, and after any correction in the tracker: fixing a quote upstream
correctly breaks the dive until the dive is fixed to match.

**Scare quotes count as quotations.** A heading like `What "the record shows" means` fails,
because the check cannot tell emphasis from speech. Reword instead of weakening the check.

### When building a dive, check one level deeper

The check above traces quotes to the tracker entry. When writing a new dive, also confirm each
quotation against the saved text of the specific source attached to it, not just the entry. That
is how the press-ban dive found three quotations in its own seed entry that did not match their
originals (a spliced court quote, a transcript word that was not said, and a post quoted from a
sentence no saved source contained). They were corrected in the tracker first, then here. If a
quote cannot be confirmed in any attached source, drop it or state the fact without quotation
marks.

## Style check (automatic)

A `PostToolUse` hook (`.claude/settings.json` → `.claude/hooks/style-check.mjs`, adapted from
election-rigging's) runs after every Write or Edit to `src/data/*.json` and `src/pages/**/*.astro`.
It reads the file from disk. Same rules as election-rigging: no em dashes in titles, no em-dash
stacking in one field, a density floor of 1 per 80 words of our prose, the 43-phrase AI list, at
most two `let's`, no emoji. Text inside quotation marks, `quote` and `claim` fields, and source
headlines are exempt: they are other people's words.

```bash
echo '{"tool_input":{"file_path":"'$PWD'/src/data/press-ban.json"}}' | node .claude/hooks/style-check.mjs
```

## Adding a dive

1. Pick the seed tracker entries. The dive can only say what they (and their sources) support.
2. Write `src/data/<slug>.json` to the model above, pulling every source from a seed entry by
   exact match. Confirm quotes against the attached sources' text.
3. Copy `src/pages/press-ban.astro` to `src/pages/<slug>.astro` and adapt the sections to the
   story. Not every dive needs every section.
4. Add the dive to `src/data/dives.json`.
5. `node verify-sources.js`, `npm run build`, check it in the browser at desktop and phone width.

## Keeping a dive current

When the seed entry changes in a tracker batch, update the dive's data in the same pass: new
events into `days`, a changed `meta.status` and `meta.statusText`, retired and new `watch` items,
and `updated`. Log any correction in `corrections`, including corrections made to the seed entry.

The countdown counts down only while the order has days left. From its end date it shows "Order
set to end [date]" instead of "0 days left", which stays true whatever the court does next, but
the status itself still has to be updated by hand.

## Design notes

- Dark theme only, tokens and status palette shared with election-rigging.
- **Color means an actor, and only an actor.** In the timeline, red is the administration, blue
  the court, purple the press, amber Congress. Nothing editorial borrows those colors: the take
  is neutral gray, and the two columns of "Who objected, and who defended it" get identical cards.
  A colored accent on one side reads as the page taking it.
- Hero figures are about the story, not the page. The source count goes in the eyebrow.
- Below 1000px the section links move to a second, sideways-scrolling row of the topbar
  (`.subnav` in `Base.astro`). Sticky offsets use `--head-h`, which grows to match.
- Titles follow the tracker's headline rules: organic, newspaper-style, no em dashes.
- No emojis. Arrows and typographic marks are fine.
- Links to sibling sites use their configured domains only if they resolve. At creation,
  `riggedbeforethevote.com` did not, so it is not linked.

## Deployment

Static build, intended for Vercel like the other politiboop sites. `.nvmrc` pins Node 22.12.0+.
The `site` URL in `astro.config.mjs` is a placeholder until a domain is chosen. Commit, and ask
before pushing, per workspace convention.
