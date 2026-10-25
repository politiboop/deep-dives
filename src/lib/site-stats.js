/**
 * What this site says about itself at /stats.json, so the other sites in the network
 * (the tracker's "Elsewhere" panels, for one) can show current numbers without anyone
 * editing a count by hand. Nothing here is typed in: the count is the number of dives
 * in src/data/dives.json, and the date is the newest `updated` among those dives' own
 * data files.
 *
 *   { "site": "dives", "dives": <dives in the registry>,
 *     "lastUpdated": "YYYY-MM-DD", "generatedAt": "<ISO timestamp of the build>" }
 *
 * Only dives the registry lists count. A data file that is not in dives.json is a draft,
 * not a published dive, and must not move the date.
 */
export function buildStats({ registry, dataBySlug, now = new Date() }) {
  const dates = registry.map((d) => {
    const updated = dataBySlug[d.slug]?.updated;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(updated || '')) {
      throw new Error(`stats.json: dive "${d.slug}" is in src/data/dives.json but src/data/${d.slug}.json has no \`updated\` date (YYYY-MM-DD)`);
    }
    return updated;
  });
  return {
    site: 'dives',
    dives: registry.length,
    lastUpdated: dates.reduce((a, b) => (b > a ? b : a)),
    generatedAt: now.toISOString(),
  };
}
