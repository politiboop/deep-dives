/**
 * Days to the 2026 midterms, for the network strip's chip (UI-ROADMAP.md WP4).
 *
 * The election is an Eastern-time event, so the count turns over at midnight in New York
 * for every reader, the same rule election-rigging's own header chip follows
 * (src/lib/election-clock.js in that repo). Pure: hand in any Date to see what the chip
 * would say then. The chip is drawn in the browser, on the reader's clock, because this
 * site is built once per deploy and a number baked into the HTML would be wrong by the
 * next morning.
 */

export const ELECTION_DAY = '2026-11-03';
const TIME_ZONE = 'America/New_York';

const NEW_YORK = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});

/** The calendar date in New York at `now`, as YYYY-MM-DD. */
export function newYorkDate(now = new Date()) {
  const p = Object.fromEntries(NEW_YORK.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${p.year}-${p.month}-${p.day}`;
}

// A calendar date as a whole number of days. UTC midnights carry no daylight-saving
// offset, so the difference of two of these is an exact count of calendar days.
const dayNumber = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
};

/** Whole calendar days from `now` (in New York) to Election Day: 0 on the day, negative after. */
export function daysToMidterms(now = new Date()) {
  return dayNumber(ELECTION_DAY) - dayNumber(newYorkDate(now));
}

/**
 * What the chip says at `now`, or null once Election Day has passed (the chip then
 * disappears). `number` is the figure that gets the accent color; `text` follows it.
 *   9 days out  { number: '9', text: ' days to the midterms' }
 *   1 day out   { number: '1', text: ' day to the midterms' }
 *   the day     { number: '',  text: 'Election Day' }
 */
export function midtermsChip(now = new Date()) {
  const days = daysToMidterms(now);
  if (days < 0) return null;
  if (days === 0) return { number: '', text: 'Election Day' };
  return { number: String(days), text: `${days === 1 ? ' day' : ' days'} to the midterms` };
}
