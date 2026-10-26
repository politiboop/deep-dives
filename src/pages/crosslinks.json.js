// /crosslinks.json: where the dives cover each tracker entry, for the tracker to read.
// Written once, at build time, next to stats.json and the sitemap, so every deploy publishes
// the links its own data produced.
//
//   { "<entryId>": [{ "site": "dives", "title": "<dive or event title>", "url": "https://.../<slug>/#<anchor>" }] }
//
// The tracker reads it when IT builds, so a new event can take a few minutes after a deploy
// here to appear on the entry's page there. See src/lib/crosslinks.js.
import registry from '../data/dives.json';
import titles from '../generated/tracker-titles.json';
import { buildCrosslinks, linkedTrackerIds, idsWithoutTitle } from '../lib/crosslinks.js';

// Each dive's data file, keyed by slug, the same way the front door loads them.
const files = import.meta.glob('../data/*.json', { eager: true });
const dives = Object.fromEntries(registry.map((d) => [d.slug, files[`../data/${d.slug}.json`]?.default]));

export function GET({ site }) {
  if (!site) throw new Error('crosslinks.json: `site` is not set in astro.config.mjs, so the dive links have no origin');
  for (const d of registry) {
    if (!dives[d.slug]) throw new Error(`crosslinks.json: dive "${d.slug}" is in src/data/dives.json but src/data/${d.slug}.json does not exist`);
  }

  // The pages label their "Tracker entry" links from the titles snapshot. Say so at build time
  // when the snapshot is behind the data; the pages still build, with the bare id as the label.
  const untitled = idsWithoutTitle(linkedTrackerIds({ registry, dives }), titles);
  if (untitled.length) {
    console.warn(`[crosslinks] ${untitled.length} tracker entr${untitled.length === 1 ? 'y has' : 'ies have'} no title in src/generated/tracker-titles.json, so their links are labeled with the id. Run \`node sync-tracker-titles.js\`.`);
  }

  const links = buildCrosslinks({ registry, dives, origin: site.origin });
  return new Response(JSON.stringify(links, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
