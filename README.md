# Deep Dives

One story at a time, taken all the way down. Each dive follows a single episode from the first post
to the latest ruling, sets what was claimed against what the record shows, and links every fact to
its source.

- **Paid For**, public money and the president's image: a ledger of who pays for the banners,
  the app, Trump TV, the government-paid ad and the ballroom, 18 events over a year, and 49 sources.
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
