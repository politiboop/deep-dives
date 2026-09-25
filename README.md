# Deep Dives

One story at a time, taken all the way down. Each dive follows a single episode from the first post
to the latest ruling, sets what was claimed against what the record shows, and links every fact to
its source.

- **Corruption**, a section of three questions: is he profiting from the office, is access being
  sold, and is public money promoting him. Each is answered by its own dive:
  - **The Ballroom** (access): who is paying for it, what the donors have won since, the public
    money added, and a Supreme Court stay that left its legality undecided.
  - **Paid For** (public money): banners of his face, an app on federal phones, Trump TV and a
    government-paid ad, what each cost and who paid.
- **Shut Out**, the White House press ban: 26 events over six days, seven of the government's
  claims set against the court record, and 68 sources.
- Built on The Trump Tracker. Every link and every quotation traces to a verified tracker entry,
  and `npm run verify` fails if one does not.
- Facts and opinions are separated by design. Opinion appears only in a labeled "Our take."

## Stack

Astro 6, static, no frameworks. Each dive's content lives in `src/data/<slug>.json`; its page
computes every figure from that file at build time.

```bash
npm install
npm run dev      # local dev server
npm run verify   # source and quotation integrity check
npm run build    # static build
```

See `CLAUDE.md` for the data model, the integrity rules and how to add a dive.
