// /stats.json: this site's own numbers, for the other sites in the network to read.
// Written once, at build time, so every deploy publishes the numbers its own data
// produced. See src/lib/site-stats.js.
import registry from '../data/dives.json';
import { buildStats } from '../lib/site-stats.js';

// Each dive's data file, keyed by slug, the same way the front door loads them.
const files = import.meta.glob('../data/*.json', { eager: true });
const dataBySlug = Object.fromEntries(registry.map((d) => [d.slug, files[`../data/${d.slug}.json`]?.default]));

export function GET() {
  const stats = buildStats({ registry, dataBySlug });
  return new Response(JSON.stringify(stats, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
