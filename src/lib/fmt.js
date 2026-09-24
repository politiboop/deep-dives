// Formatting helpers shared by every page. Dates are ISO strings (YYYY-MM-DD)
// and are read as calendar dates, never shifted by a time zone.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const parts = (d) => d.split('-').map(Number);
const utc = (d) => { const [y, m, day] = parts(d); return Date.UTC(y, m - 1, day); };

export const longDate = (d) => { const [y, m, day] = parts(d); return `${MONTHS_LONG[m - 1]} ${day}, ${y}`; };
export const shortDate = (d) => { const [, m, day] = parts(d); return `${MONTHS[m - 1]} ${day}`; };
export const weekday = (d) => DOW[new Date(utc(d)).getUTCDay()];
export const daysBetween = (a, b) => Math.round((utc(b) - utc(a)) / 86400000);

// "CNN: Headline (date)" -> "CNN". Court filings keep a short, readable label.
export const outlet = (t) => {
  const head = t.split(':')[0].trim();
  const ecf = t.match(/ECF \d+(-\d+)?/);
  if (/: Temporary Restraining Order, ECF/.test(t)) return `The order, ${ecf[0]}`;
  if (/Defendants' Opposition/.test(t)) return `Government's brief, ${ecf[0]}`;
  if (/^Cable News Network, Inc\./.test(head)) {
    if (/Complaint/.test(t)) return 'The complaint';
    return ecf ? `Court filing, ${ecf[0]}` : 'Court filing';
  }
  if (/^CourtListener/.test(head)) return 'The docket';
  if (/^Mahoney v\./.test(t)) return 'D.C. Circuit, Mahoney';
  if (/^Trump's Truth/.test(head)) return 'Truth Social archive';
  return head.length > 48 ? head.slice(0, 46) + '…' : head;
};

export const slug = (s) => s.toLowerCase().replace(/['‘’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);

// Typographer's quotes. The data keeps straight quotes, which is what the
// integrity check and the tracker use; the page renders curly ones. An
// apostrophe inside a word, or after one, closes; a quote after a space or an
// opening bracket or dash opens.
export const smart = (s) => s
  .replace(/(^|[\s([{\u2014\u2013-])"/g, '$1“')
  .replace(/"/g, '”')
  .replace(/(\w)'(?=\w)/g, '$1’')
  .replace(/(^|[\s([{“\u2014\u2013-])'/g, '$1‘')
  .replace(/'/g, '’');

// Apply `smart` to every string in a dive's data except the ones that are
// identifiers, dates or source records (source headlines are matched as written).
const RAW = new Set(['url', 'sources', 'slug', 'trackerIds', 'actor', 'date', 'updated', 'bannedFrom', 'restored', 'orderEnds']);
export function smartAll(o, key) {
  if (RAW.has(key)) return o;
  if (typeof o === 'string') return smart(o);
  if (Array.isArray(o)) return o.map((x) => smartAll(x, key));
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, smartAll(v, k)]));
  return o;
}

// Unique source URLs anywhere inside an object.
export function sourceCount(o) {
  const urls = new Set();
  (function walk(x) {
    if (Array.isArray(x)) return x.forEach(walk);
    if (x && typeof x === 'object') {
      if (Array.isArray(x.sources)) x.sources.forEach((s) => urls.add(s.url));
      Object.values(x).forEach(walk);
    }
  })(o);
  return urls.size;
}
