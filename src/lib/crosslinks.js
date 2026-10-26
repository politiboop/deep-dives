/**
 * Cross-links between the dives and The Trump Tracker (UI-ROADMAP.md WP5).
 *
 * Every dive lists the tracker entries it was built from in its top-level `trackerIds`, and
 * an event (or any other item) may carry its own, narrower `trackerIds`. Two things are made
 * from those lists and from nothing else, so no link here is ever typed by hand:
 *
 *   1. The "Tracker entry" links on events, ledger rows and claims that carry their own
 *      ids, and the list of a dive's seed entries in its Method section (TrackerLinks.astro),
 *      pointing at each entry's own page on the tracker, labeled with the entry's title.
 *   2. /crosslinks.json, which the tracker reads when it builds so that an entry's page can
 *      say where else it is covered:
 *
 *        { "<entryId>": [{ "site": "dives", "title": "...", "url": "https://.../<slug>/#<anchor>" }] }
 *
 * This file is pure (no fs, no JSON imports) so the pages, the build-time endpoint and the
 * Node scripts that check it can all import it.
 */
import { NETWORK } from './network.js';
import { slug, smartAll } from './fmt.js';

const TRACKER = NETWORK.find((s) => s.id === 'tracker').href.replace(/\/+$/, '');

/** An entry's page on the tracker, at the address the tracker builds for it. */
export const trackerEntryUrl = (id) => `${TRACKER}/controversy/${id}/`;

/**
 * The DOM id of an event on its dive's page. Every dive page and the corruption timeline
 * build it this way, from the event's own date and (typographer's-quote) title, so this is
 * the one definition: a link made here cannot drift from the id on the page.
 */
export const eventAnchor = (date, title) => `${date}-${slug(title)}`;

/** The label for a "Tracker entry" link: the entry's title from the snapshot, or the bare id. */
export const trackerLabel = (titles, id) => titles[id] || id;

/** Every id in a `trackerIds` array anywhere inside `o`, nested items included. */
function collectIds(o, into) {
  if (Array.isArray(o)) { o.forEach((x) => collectIds(x, into)); return into; }
  if (o && typeof o === 'object') {
    for (const id of o.trackerIds || []) into.add(id);
    Object.values(o).forEach((x) => collectIds(x, into));
  }
  return into;
}

/** Every tracker entry any dive in the registry links to, top level and per item. Sorted, unique. */
export function linkedTrackerIds({ registry, dives }) {
  const ids = new Set();
  for (const reg of registry) collectIds(dives[reg.slug], ids);
  return [...ids].sort();
}

/** The ids in `ids` the snapshot has no title for. */
export const idsWithoutTitle = (ids, titles) => ids.filter((id) => !titles[id]);

/**
 * The contents of /crosslinks.json.
 *
 * One row per place the dives cover an entry, grouped under the entry's id:
 *   - the dive itself, for every id in its top-level `trackerIds` (title: the dive's title;
 *     url: the dive's page);
 *   - each event that lists the id in its own `trackerIds` (title: the event's title; url: the
 *     event's own address in the dive), after the dive's row, in the order the dive tells them.
 *
 * Only events get a row of their own: they are the one item with an address on the page.
 * Ledger rows, claims and the rest are covered by the dive's row.
 *
 * `origin` is the site's own origin, taken from `site` in astro.config.mjs. Titles are the ones
 * the page prints (typographer's quotes), and anchors come from those same titles. Keys are
 * sorted so a rebuild changes the file only when the data changed.
 */
export function buildCrosslinks({ registry, dives, origin }) {
  const rows = new Map();
  const add = (id, row) => {
    const list = rows.get(id) || [];
    if (!list.some((r) => r.url === row.url)) list.push(row);
    rows.set(id, list);
  };

  for (const reg of registry) {
    const dive = smartAll(dives[reg.slug]);
    const diveUrl = `${origin}/${reg.slug}/`;
    for (const id of dive.trackerIds || []) add(id, { site: 'dives', title: reg.title, url: diveUrl });
    for (const day of dive.days || []) {
      for (const e of day.events || []) {
        for (const id of e.trackerIds || []) {
          add(id, { site: 'dives', title: e.title, url: `${diveUrl}#${eventAnchor(day.date, e.title)}` });
        }
      }
    }
  }

  return Object.fromEntries([...rows.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}
