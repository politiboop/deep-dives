#!/usr/bin/env node
/**
 * Source and quotation integrity audit for the deep dives.
 *
 * Every dive is written from verified controversial-trump tracker entries, listed
 * in the dive's own `trackerIds`. That gives two mechanically checkable rules:
 *
 *   1. Every source URL in a dive must appear in the sources of one of its seed
 *      entries (an item may narrow this with its own `trackerIds`).
 *   2. Every quotation in our prose, and every `quote` field, must appear verbatim
 *      in the text of a seed entry: its summary, keyFacts or source headlines.
 *
 * A URL that traces to nothing was typed from memory or orphaned by a correction
 * in the tracker. A quotation that traces to nothing was reworded, misremembered,
 * or corrected upstream after the dive was written. Every one needs a human look.
 *
 * Usage:
 *   node verify-sources.js             # audit every dive listed in src/data/dives.json
 *   node verify-sources.js --verbose   # also list what passed
 *
 * Exit code 1 on any failure, so it can gate a commit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'src', 'data');
const trackerDir = path.join(__dirname, '..', 'controversial-trump', 'data', 'controversies');
const verbose = process.argv.includes('--verbose');

if (!fs.existsSync(trackerDir)) {
  console.error(`! Tracker repo not found at ${trackerDir}`);
  console.error('  This check needs controversial-trump cloned alongside deep-dives.');
  process.exit(1);
}

const normUrl = (u) => String(u).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').toLowerCase();

// Quotation text varies between outlets in ways that do not change the words:
// curly vs straight quotes, dash forms and spacing, invisible joiners, ellipsis
// forms, and bracketed alterations such as "[N]othing". Flatten all of that.
function normText(s) {
  return String(s)
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/…/g, '...')
    .replace(/[‐-―−]/g, '-')
    .replace(/[​-‍⁠-⁤﻿­]/g, '')
    .replace(/\[(\w)\]/g, '$1')
    .replace(/-\s*\n\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ?- ?/g, '-')
    .replace(/["']/g, '')          // nested-quote style is typography, not wording
    .toLowerCase()
    .trim();
}

// Split a quotation on ellipses; each fragment must appear on its own.
const fragments = (q) => q.split(/\.\.\.|…/).map((f) => f.trim().replace(/^[\s.,;:]+|[\s.,;:]+$/g, '')).filter((f) => f.split(/\s+/).length >= 2);

// Double-quoted spans of two words or more, straight or curly.
function quotesIn(s) {
  const out = [];
  const re = /["“]([^"“”]+)["”]/g;
  let m;
  while ((m = re.exec(s))) if (m[1].trim().split(/\s+/).length >= 2) out.push(m[1]);
  return out;
}

const loadEntry = (id) => {
  const f = path.join(trackerDir, `${id}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
};

const registry = JSON.parse(fs.readFileSync(path.join(dataDir, 'dives.json'), 'utf8'));
let failures = 0;

for (const reg of registry) {
  const file = path.join(dataDir, `${reg.slug}.json`);
  if (!fs.existsSync(file)) { console.log(`❌ ${reg.slug}: no data file at src/data/${reg.slug}.json`); failures++; continue; }
  const dive = JSON.parse(fs.readFileSync(file, 'utf8'));

  const entries = {};
  const missing = [];
  const collectIds = (o) => {
    if (Array.isArray(o)) return o.forEach(collectIds);
    if (o && typeof o === 'object') { (o.trackerIds || []).forEach((id) => { if (!(id in entries)) { entries[id] = loadEntry(id); if (!entries[id]) missing.push(id); } }); Object.values(o).forEach(collectIds); }
  };
  collectIds(dive);

  const urlsOf = (ids) => new Set(ids.flatMap((id) => (entries[id]?.sources || []).map((s) => normUrl(s.url))));
  const corpusOf = (ids) => normText(ids.map((id) => {
    const e = entries[id]; if (!e) return '';
    return [e.title, e.summary, ...(e.keyFacts || []), ...(e.sources || []).map((s) => s.text)].join('\n');
  }).join('\n'));

  const untraced = [], unquoted = [], sourceless = [];
  let urlCount = 0, quoteCount = 0;

  // Walk the dive, tracking the nearest enclosing trackerIds.
  const walk = (o, ids, where, key) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, ids, `${where}[${i}]`, key));
    if (o && typeof o === 'object') {
      const scope = o.trackerIds && o.trackerIds.length ? o.trackerIds : ids;
      if (Array.isArray(o.sources)) {
        const seed = urlsOf(scope);
        for (const s of o.sources) {
          urlCount++;
          if (!s || !s.url || !s.text) { sourceless.push(`${where}: a source is missing its text or url`); continue; }
          if (!seed.has(normUrl(s.url))) untraced.push({ where, url: s.url });
        }
      }
      // An item that states facts in its own voice must cite them. A container whose
      // `quote` is itself an object with its own sources is not such an item.
      const states = Array.isArray(o.body) || ['holding', 'quote', 'detail'].some((k) => typeof o[k] === 'string');
      if (states && !(o.sources && o.sources.length)) {
        sourceless.push(`${where}: carries text but no sources`);
      }
      for (const [k, v] of Object.entries(o)) {
        if (k === 'sources' || k === 'trackerIds') continue;
        walk(v, scope, `${where}.${k}`, k);
      }
      return;
    }
    if (typeof o !== 'string') return;
    // `quote` fields are someone's words in full; everywhere else, check the quoted spans.
    const quotes = key === 'quote' || (key === 'text' && where.endsWith('.quote.text')) ? [o] : quotesIn(o);
    const corpus = corpusOf(ids);
    for (const q of quotes) {
      for (const f of fragments(q)) {
        quoteCount++;
        if (!corpus.includes(normText(f))) unquoted.push({ where, q: f });
      }
    }
  };
  walk(dive, dive.trackerIds || [], reg.slug, '');

  // Quotations typed straight into the page template count too.
  const page = path.join(__dirname, 'src', 'pages', `${reg.slug}.astro`);
  if (fs.existsSync(page)) {
    const copy = fs.readFileSync(page, 'utf8')
      .replace(/^---[\s\S]*?\n---/, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/\{[^{}]*\}/g, ' ')
      .replace(/<[^>]*>/g, ' ');
    const corpus = corpusOf(dive.trackerIds || []);
    for (const q of quotesIn(copy)) {
      for (const f of fragments(q)) {
        quoteCount++;
        if (!corpus.includes(normText(f))) unquoted.push({ where: `src/pages/${reg.slug}.astro`, q: f });
      }
    }
  }

  console.log(`\n${reg.slug}: ${urlCount} source links, ${quoteCount} quoted passages, seeded from ${Object.keys(entries).length} tracker ${Object.keys(entries).length === 1 ? 'entry' : 'entries'}`);
  if (missing.length) { failures += missing.length; console.log(`  ❌ trackerIds with no entry file: ${missing.join(', ')}`); }
  if (sourceless.length) { failures += sourceless.length; console.log(`  ❌ ${sourceless.length} item(s) without sources:`); sourceless.forEach((s) => console.log(`     ${s}`)); }
  if (untraced.length) {
    failures += untraced.length;
    console.log(`  ❌ ${untraced.length} source URL(s) not found in any seed entry:`);
    untraced.forEach((u) => console.log(`     ${u.url}\n        at ${u.where}`));
  }
  if (unquoted.length) {
    failures += unquoted.length;
    console.log(`  ❌ ${unquoted.length} quotation(s) not found verbatim in any seed entry:`);
    unquoted.forEach((u) => console.log(`     "${u.q.slice(0, 110)}${u.q.length > 110 ? '…' : ''}"\n        at ${u.where}`));
  }
  if (!missing.length && !sourceless.length && !untraced.length && !unquoted.length) {
    console.log(`  🎉 Clean — every link traces to a seed entry, and every quotation appears in one.`);
  } else if (verbose) {
    console.log('  (see above)');
  }
}

if (failures) {
  console.log(`\n${failures} problem(s). Fix the dive, or fix the tracker entry first if the dive is right and the entry is not.`);
  console.log('Exit code 1 — non-zero so this can gate a commit.');
  process.exit(1);
}
