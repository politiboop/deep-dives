#!/usr/bin/env node
// Style checker for the deep dives. Runs as a PostToolUse hook. Adapted from
// election-rigging's checker; the rules and thresholds are the same.
//
// Reads the file FROM DISK rather than from the tool payload. PostToolUse fires
// after the write, so the file is already there, and an Edit (which only carries
// its replacement string) gets checked in full rather than passing vacuously.
//
// Em dashes and AI phrases are judged by context, because not every one is ours:
//   title    — a card or section headline: em dashes banned outright (CLAUDE.md)
//   prose    — our own writing: density limit, phrase list, "let's"
//   quote    — inside "…": a source's own words, reproduced verbatim; exempt
//   headline — sources[].text: an outlet's headline as published; exempt
//
// Exit 0 = pass, 2 = fail (the message goes back to Claude to fix).
import fs from 'node:fs';
import path from 'node:path';

const EM = '—';
const WORDS_PER_EM_DASH_MIN = 80;   // house floor; the target is 150-200
const MAX_LETS = 2;

const AI_PHRASES = [
  "here's the thing", "here's why that matters", "here's what you need to know",
  "let's be clear", "to be clear", "let's break this down", "let's unpack",
  "it's worth noting", "it's important to understand", "it's important to note",
  "the bottom line is", "the takeaway here", "in other words", "put simply",
  "make no mistake", "full stop", "let that sink in", "read that again",
  "this cannot be overstated", "this is not a drill", "spoiler alert",
  "the short answer", "the long answer", "buckle up", "fasten your seatbelt",
  "that's not a typo", "you read that right", "this is not hyperbole",
  "in a nutshell", "at the end of the day", "the elephant in the room",
  "the writing is on the wall", "a deep dive", "double down", "the reality is",
  "the truth is", "here's the kicker", "plot twist", "game changer",
  "think about that for a moment", "sit with that for a moment", "let me be clear",
];

// ---------------------------------------------------------------- input
let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch { }
let payload = {};
try { payload = JSON.parse(raw || '{}'); } catch { }
const file = payload?.tool_input?.file_path || payload?.tool_response?.filePath || '';
if (!file) process.exit(0);

const rel = file.replace(/\\/g, '/');
const WATCHED = /\/src\/(data\/[^/]+\.json|pages\/.+\.astro)$/;
if (!WATCHED.test(rel)) process.exit(0);
if (!fs.existsSync(file)) process.exit(0);

// ---------------------------------------------------------------- helpers
// Mark the character indexes that sit inside a "…" span.
function quotedMask(s) {
  const mask = new Array(s.length).fill(false);
  let open = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === '“' || c === '”') {
      if (open === -1) open = i;
      else { for (let j = open; j <= i; j++) mask[j] = true; open = -1; }
    }
  }
  return mask;
}

const segments = [];   // { where, text, kind }
const add = (where, text, kind) => { if (typeof text === 'string' && text.trim()) segments.push({ where, text, kind }); };

// ---------------------------------------------------------------- collect
let parsed = null;
if (rel.endsWith('.json')) {
  try { parsed = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) {
    console.error(`STYLE CHECK: could not parse ${path.basename(file)} as JSON — ${e.message}`);
    process.exit(2);
  }
}

// Dive data files are walked generically. The key names say whose words a string is:
//   title          -> a headline: em dashes banned outright
//   quote, claim   -> someone else's words, quoted: exempt
//   sources[].text -> an outlet's headline as published: exempt
//   names, lead, highlight -> proper names in the amicus roster: exempt
//   ids, dates, urls and similar -> not prose: skipped
// Everything else is our own prose.
const SKIP = new Set(['slug', 'url', 'date', 'updated', 'actor', 'year', 'when', 'time', 'trackerIds',
  'bannedFrom', 'restored', 'orderEnds', 'kicker', 'outlets', 'names', 'lead', 'highlight', 'quote', 'claim', 'cite']);
if (rel.endsWith('.json')) {
  const walk = (o, where, key) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${where}[${i}]`, key));
    if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (k === 'sources' && Array.isArray(v)) { v.forEach((src, i) => add(`${where}.sources[${i}]`, src && src.text, 'headline')); continue; }
        if (k === 'text' && key === 'quote') continue;   // hero.quote.text is the judge's words
        if (SKIP.has(k)) continue;
        walk(v, `${where}.${k}`, k);
      }
      return;
    }
    if (typeof o !== 'string') return;
    add(where, o, key === 'title' ? 'title' : 'prose');
  };
  walk(parsed, path.basename(file, '.json'), '');
} else {
  // .astro — page copy only: drop the component script, styles and client JS.
  let s = fs.readFileSync(file, 'utf8')
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');
  s.split('\n').forEach((line, n) => {
    const text = line.replace(/<[^>]*>/g, ' ').replace(/\{[^}]*\}/g, ' ')
      .replace(/&mdash;/g, EM).replace(/&[a-z]+;/g, ' ').trim();
    add(`${path.basename(file)}:${n + 1}`, text, 'prose');
  });
}

// ---------------------------------------------------------------- check
const issues = [];
const titleDashes = [];
const phraseHits = [];
const emojiHits = [];
const denseFields = [];
let proseWords = 0, proseDashes = 0, letsCount = 0;

// A single fact or take carrying this many em dashes is dense on its own terms.
// The file-wide ratio cannot catch that: one loaded card is a rounding error
// against 19,000 words, and a card is the unit somebody actually writes.
const MAX_EM_DASHES_PER_FIELD = 3;

// Pictographic emoji. The repo bans them outright; arrows and typographic marks are fine.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

for (const seg of segments) {
  const { where, text, kind } = seg;
  const mask = quotedMask(text);

  if (EMOJI.test(text)) emojiHits.push(where);

  if (kind === 'title') {
    if (text.includes(EM)) titleDashes.push(`${where}: ${text.slice(0, 80)}`);
    continue;
  }
  if (kind !== 'prose') continue;   // source headlines are reproduced as published

  proseWords += text.split(/\s+/).filter(Boolean).length;

  let local = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === EM && !mask[i]) { proseDashes++; local++; }
  }
  if (local >= MAX_EM_DASHES_PER_FIELD) denseFields.push(`${where}: ${local} em dashes`);

  // Phrases and "let's" only count outside quotations.
  const lower = text.toLowerCase();
  for (const p of AI_PHRASES) {
    let i = lower.indexOf(p);
    while (i !== -1) {
      if (!mask[i]) phraseHits.push(`"${p}" in ${where}`);
      i = lower.indexOf(p, i + 1);
    }
  }
  let li = lower.indexOf("let's ");
  while (li !== -1) {
    if (!mask[li]) letsCount++;
    li = lower.indexOf("let's ", li + 1);
  }
}

if (titleDashes.length) {
  issues.push(`EM DASH IN A TITLE (${titleDashes.length}) — this repo bans them in card and section titles outright:\n    ` + titleDashes.join('\n    '));
}
if (emojiHits.length) {
  issues.push(`EMOJI (${emojiHits.length}) — the repo uses none:\n    ` + emojiHits.join('\n    '));
}
if (denseFields.length) {
  issues.push(`EM DASHES STACKED IN ONE FIELD (${denseFields.length}) — ${MAX_EM_DASHES_PER_FIELD} or more in a single fact, take or line:\n    ` + denseFields.join('\n    '));
}
if (proseDashes > 0 && proseWords > 0) {
  const ratio = Math.round(proseWords / proseDashes);
  if (ratio < WORDS_PER_EM_DASH_MIN) {
    issues.push(`EXCESSIVE EM DASHES: ${proseDashes} in ${proseWords} words of our own prose (1 per ${ratio}). Human writing runs 1 per 150-200. Quotes and source headlines were excluded, so these are ours. Replace some with commas, periods or parentheses.`);
  }
}
if (phraseHits.length) {
  issues.push(`AI PHRASES (${phraseHits.length}), outside quotations:\n    ` + phraseHits.join('\n    '));
}
if (letsCount > MAX_LETS) {
  issues.push(`OVERUSING "LET'S": ${letsCount} outside quotations. It simulates partnership with the reader. Just say the thing.`);
}

if (issues.length) {
  console.error(`STYLE CHECK FAILED — ${issues.length} issue(s) in ${path.basename(file)}:`);
  issues.forEach(i => console.error(`\n- ${i}`));
  console.error(`\nSee CLAUDE.md. Quotes from sources and outlet headlines are exempt and were not counted.`);
  process.exit(2);
}
process.exit(0);
