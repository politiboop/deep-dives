// One level deeper than verify-sources.js: every quotation in a dive must appear in the
// saved text of a source attached to the same item, not merely somewhere in the tracker.
//
//   node scripts/check-quotes-at-source.cjs src/data/<slug>.json <map.tsv>
//
// map.tsv lists "<url>\t<path to saved text>" for each source (fetch them first with the
// tracker's fetch-article.js). Items with no sources (the deck, the take) are checked
// against every saved text. Exits non-zero on any miss or any source with no saved text.
const fs = require('fs');
const [divePath, mapPath] = process.argv.slice(2);
if (!divePath || !mapPath) { console.error('usage: check-quotes-at-source.cjs <dive.json> <map.tsv>'); process.exit(2); }
const dive = JSON.parse(fs.readFileSync(divePath, 'utf8'));
const files = new Map(fs.readFileSync(mapPath, 'utf8').trim().split('\n').map((l) => l.split('\t')));

// Court PDFs repeat a running header on every page, which can split a quotation.
const stripHeaders = (t) => t
  .replace(/Cite as: \d+ U\. ?S\. _+ \(\d{4}\) \d* ?(Per Curiam|[A-Z .,]+, dissenting)?/g, ' ')
  .replace(/\n\s*\d+\s+[A-Z][A-Z .,'’-]{20,} v\. [A-Z .,'’-]{10,}\n/g, '\n');
const norm = (s) => stripHeaders(s).normalize('NFKC')
  .replace(/-\s*\n\s*/g, '').replace(/[​-‍⁠-⁤﻿­]/g, '')
  .replace(/[“”‟″]/g, '"').replace(/[‘’‛′]/g, "'").replace(/…/g, '...')
  .replace(/[‒-―−]/g, '-').replace(/ ?- ?/g, '-')
  .replace(/\[([A-Za-z])\]/g, '$1').replace(/["']/g, '')
  .replace(/\s+/g, ' ').toLowerCase().trim();
const cache = new Map();
const text = (u) => {
  if (!cache.has(u)) { const p = files.get(u); cache.set(u, p && fs.existsSync(p) ? norm(fs.readFileSync(p, 'utf8')) : ''); }
  return cache.get(u);
};
const all = [...files.keys()].map(text).join(' || ');
const quotesIn = (s) => [...String(s || '').matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const frags = (q) => q.split(/\.\.\.|…|\. \. \./).map((x) => x.trim().replace(/[.,;:!?]+$/, '')).filter((x) => x.split(/\s+/).length >= 2);

const items = [];
const push = (where, strings, sources, whole = []) => items.push({ where, strings, urls: (sources || []).map((s) => s.url), whole });
const h = dive.hero || {};
push('hero.deck', h.deck || [], null);
if (h.answer) push('hero.answer', [h.answer], null);
if (h.rule) push('hero.rule', [h.rule], h.ruleSources);
if (h.quote) push('hero.quote', [h.quote.lead], h.quote.sources, [h.quote.text]);
push('meta', [dive.meta.dek, dive.meta.statusText], null);
(dive.ledger || []).forEach((r, i) => push(`ledger[${i}] ${r.item}`, [r.item, r.note, r.payer], r.sources));
(dive.days || []).forEach((d) => d.events.forEach((e) => push(`${d.date} ${e.title}`, [e.title, ...e.body], e.sources)));
(dive.claims || []).forEach((c, i) => push(`claims[${i}]`, [c.detail], c.sources, /paraphrased/i.test(c.who) ? [] : [c.claim]));
for (const side of ['objected', 'defended']) ((dive.voices || {})[side] || []).forEach((v) => push(`voices.${side} ${v.who}`, [], v.sources, [v.quote]));
(dive.rules || []).forEach((r) => push(`rules ${r.name}`, [r.body], r.sources));
(dive.precedent || []).forEach((p) => push(`precedent ${p.name}`, [p.holding], p.sources));
(dive.watch || []).forEach((w) => push(`watch ${w.title}`, [w.text], w.sources));
(dive.take || []).forEach((t, i) => push(`take[${i}]`, [t], null));

let n = 0; const miss = []; const unread = new Set();
for (const it of items) {
  for (const u of it.urls) if (!text(u)) unread.add(u);
  const hay = it.urls.length ? it.urls.map(text).join(' || ') : all;
  for (const q of [...it.strings.flatMap(quotesIn), ...it.whole]) for (const f of frags(q)) {
    n++;
    if (!hay.includes(norm(f))) miss.push(`${all.includes(norm(f)) ? 'IN ANOTHER SOURCE' : 'NOT FOUND'} | ${it.where}\n    "${f}"`);
  }
}
console.log(`${dive.slug}: ${n} quoted fragments checked against the saved text of their own sources`);
miss.forEach((m) => console.log(m));
if (unread.size) console.log(`\n${unread.size} source(s) with no saved text:\n  ` + [...unread].join('\n  '));
process.exit(miss.length || unread.size ? 1 : 0);
