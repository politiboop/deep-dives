#!/usr/bin/env node
/**
 * Writes src/generated/tracker-titles.json: the title of every tracker entry the dives
 * link to, read from the entry files in controversial-trump.
 *
 * Why a snapshot. Each event, ledger row or claim that carries its own `trackerIds`, and
 * each dive's Method section, shows "Tracker entry" links labeled with the entry's title
 * (UI-ROADMAP.md WP5). Vercel builds this repo on its own, so the build cannot reach the
 * tracker's data folder. The titles are copied here, by this script, and the build bundles
 * the copy. `node verify-sources.js` fails when the copy is behind the tracker, so a
 * corrected title or a new seed entry cannot ship with a stale label.
 *
 * Run it after any edit to a `trackerIds` list (a rebuilt dive included), and after a title
 * is corrected in the tracker:
 *
 *   node sync-tracker-titles.js
 *
 * It needs controversial-trump cloned beside this repo, like verify-sources.js. It never
 * invents a title: an id with no entry file stops it, and nothing is written.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { linkedTrackerIds } from './src/lib/crosslinks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'src', 'data');
const trackerDir = path.join(__dirname, '..', 'controversial-trump', 'data', 'controversies');
const outPath = path.join(__dirname, 'src', 'generated', 'tracker-titles.json');

if (!fs.existsSync(trackerDir)) {
  console.error(`! Tracker repo not found at ${trackerDir}`);
  console.error('  This script needs controversial-trump cloned alongside deep-dives.');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(path.join(dataDir, 'dives.json'), 'utf8'));
const dives = Object.fromEntries(registry.map((d) => [d.slug, JSON.parse(fs.readFileSync(path.join(dataDir, `${d.slug}.json`), 'utf8'))]));
const ids = linkedTrackerIds({ registry, dives });

const titles = {};
const missing = [];
for (const id of ids) {
  const file = path.join(trackerDir, `${id}.json`);
  if (!fs.existsSync(file)) { missing.push(id); continue; }
  const title = JSON.parse(fs.readFileSync(file, 'utf8')).title;
  if (typeof title !== 'string' || !title.trim()) { missing.push(`${id} (entry has no title)`); continue; }
  titles[id] = title;
}

if (missing.length) {
  console.error(`! ${missing.length} trackerId(s) have no usable tracker entry; nothing was written:`);
  for (const m of missing) console.error(`    ${m}`);
  process.exit(1);
}

const next = JSON.stringify(titles, null, 2) + '\n';
const before = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, next);
console.log(`${next === before ? 'Already up to date' : 'Wrote'}: ${ids.length} titles in ${path.relative(__dirname, outPath)}`);
