// Builds src/data/his-own-account.json from its seed tracker entries (run: node scripts/build-his-own-account.cjs).
// Every source is pulled from a seed entry by a unique substring of its text, so no URL on the
// page is typed by hand. S() throws on zero or multiple matches.
//
// The page answers one question: is he profiting from the office? It answers it from his own
// 2025 financial disclosure. Ledger amounts marked `form: true` are exact dollar figures from the
// filing's income column, grouped and summed by us, with the filing's line numbers so a reader can
// check them; they add up to the total the page reports. Rows without `form` are money around his
// family's ventures that is not his reported income, and are never added to that total.
const fs = require('fs');
const path = require('path');
const TRACKER = path.join(__dirname, '..', '..', 'controversial-trump', 'data', 'controversies') + '/';
const OUT = path.join(__dirname, '..', 'src', 'data', 'his-own-account.json');
const IDS = [
  'trump-2025-financial-disclosure-2-billion-crypto-earnings',
  'trump-meme-coin',
  'trump-meme-coin-dinner-top-holders-virginia-club',
  'world-liberty-financial-crypto',
  'uae-royal-crypto-investment',
  'trump-pardons-binance-founder-changpeng-zhao',
  'media-tech-settlements-86-million-trump-library-ballroom',
  'trump-organization-dar-global-saudi-qatar-gulf-deals',
  'qatar-plane-bribe',
  'world-liberty-financial-occ-bank-charter-bid-usd1-ufc',
  'trump-jr-vulcan-elements-620m-pentagon-loan-navarro',
  'trump-private-prison-stock-trades-geo-corecivic',
];
const pool = new Map();
for (const id of IDS) for (const s of JSON.parse(fs.readFileSync(TRACKER + id + '.json', 'utf8')).sources) if (!pool.has(s.url)) pool.set(s.url, s);
function S(needle) {
  const hits = [...pool.values()].filter((s) => s.text.includes(needle));
  if (hits.length !== 1) throw new Error(`S(${JSON.stringify(needle)}) matched ${hits.length} sources`);
  return { text: hits[0].text, url: hits[0].url };
}
const srcs = (...needles) => needles.map(S);

// Sources, by a unique piece of their headline.
const OGE = 'U.S. Office of Government Ethics: Donald J. Trump, OGE Form 278e, Annual Report for 2025 (released June 30, 2026)';
const NBC_DISC = "NBC News: Trump's financial disclosure lists $1.4 billion";
const CNBC_DISC = "CNBC: Trump's annual financial disclosure shows";
const TIME_DISC = 'Time: Trump Reports Over $1 Billion';
const INDY_DISC = 'The Independent: Trump claims he had nothing';
const TNR_DISC = 'The New Republic: Trump Brags After Revealing';
const BANKING_LETTER = 'Senate Banking Committee Ranking Member: Letter to President Trump';
const MEME_SENATE = 'Letter from Sens. Warren, Schiff and Blumenthal to Fight Fight Fight';
const MEME_CNN = 'CNN: Donald and Melania Trump launch';
const MEME_CNBC = "CNBC: 58 crypto wallets";
const MEME_NYT = 'The New York Times via The Seattle Times';
const FORBES = "Forbes: 'I'm Now Broke'";
const MURPHY = 'Sen. Murphy introduces legislation';
const DIN_CNBC = "CNBC: At Trump's $148 million meme coin dinner";
const DIN_CNN = "CNN: Inside the room at Trump's meme coin dinner";
const DIN_TIME = "Time: 'An Orgy of Corruption'";
const DIN_NBC = "NBC News: Trump's crypto dinner cost";
const SUN_PAUSE = 'CoinDesk: SEC, Justin Sun, Tron Ask Court to Pause';
const SUN_SEC = 'Litigation Release No. 26496';
const MAL = 'Reuters via CNBC: Trump hosts crypto contest winners';
const WLF_CNBC = 'CNBC: New details of Trump family crypto project';
const WLF_CBS = 'CBS News: Trump plans to announce the World Liberty';
const WLF_DECRYPT = 'Decrypt: What Is World Liberty Financial';
const WLF_SUN = "CoinDesk: Trump's Sluggish DeFi Project";
const NCET = 'CNBC: DOJ ends crypto enforcement team';
const HOUSE_JUD = 'House Judiciary Committee Democrats: New Report';
const UAE_CNN = 'CNN: UAE-linked firm bought major stake';
const UAE_CNBC = "CNBC: United Arab Emirates' 'Spy Sheikh'";
const UAE_BANK = "CNBC: UAE 'spy sheikh' backs 49% stake";
const DAILY_CALLER = 'The Daily Caller: Trump Family Gets Into Bed';
const MGX_ABC = 'ABC News: Trump family crypto venture tapped';
const MGX_FORTUNE = 'Fortune: How the Trump family is poised';
const AI_CAMPUS = 'CNBC: White House announces AI data campus';
const CHIPS = 'CNBC: U.S. approves AI chip exports to Gulf';
const SIXTY = 'CBS News, 60 Minutes: Trump pardon of crypto billionaire';
const PARDON_DOJ = 'U.S. Department of Justice: Executive Grant of Clemency, Changpeng Zhao';
const PARDON_CNBC = 'CNBC: Trump pardons Binance founder';
const PARDON_WAPO = 'The Washington Post: Trump pardons convicted Binance';
const PARDON_FOXBIZ = 'Fox Business: Trump pardons convicted Binance';
const DONT_KNOW = "CBS News: Trump on Binance cryptocurrency tycoon";
const TENG = 'CNBC: Binance CEO Richard Teng denies';
const ZHAO_FOX = 'Fox News: Crypto founder pardoned by Trump';
const SEC_BINANCE = 'Reuters via Insurance Journal: SEC dismisses case against Binance';
const ABC_SETTLE = 'CBS News: ABC News agrees to contribute $15 million';
const ABC_CNN = 'CNN: Why ABC News settled';
const ABC_AP = 'Associated Press via Yahoo News: ABC agrees';
const YT_CNN = 'CNN: YouTube to pay $24.5 million';
const META = 'NBC News: Meta agrees to pay $25 million';
const META_FTC = 'Reuters via Yahoo Finance: Meta CEO Zuckerberg lobbies';
const X_SETTLE = "CNBC: Elon Musk's X to pay about $10 million";
const PARA_CBS = 'CBS News: Paramount, President Trump reach $16 million';
const PARA_NBC = 'NBC News: Paramount agrees to pay $16 million';
const PARA_LAT = 'Los Angeles Times via Yahoo News: Paramount agrees';
const CARR = 'The Wrap: FCC Chair Says CBS-Trump Settlement Talks';
const FCC = "Federal Communications Commission: FCC Approves Skydance's Acquisition";
const FCC_FOX = 'Fox News: FCC approves Paramount-Skydance merger';
const YT_CBS = 'CBS News: YouTube to pay $22 million for White House ballroom';
const YT_NPR = 'NPR: YouTube agrees to pay Trump $24 million';
const PICHAI = "CNBC: 'I'm glad it's over.'";
const LIB_WARREN = 'Warren, Blumenthal, Stansbury Press Trump Library Foundation';
const GULF_NW = 'Newsweek: New Trump Golf Course';
const GULF_MEE = 'Middle East Eye: Trump Organization and Saudi developer';
const GULF_EME = 'Economy Middle East: Trump expands GCC investments';
const GULF_PBS = 'PBS NewsHour: In a deal with Trump Organization';
const JET_NPR = 'NPR: Trump administration officially accepts jet from Qatar';
const JET_TIME = "TIME: Trump Doubles Down on Plan to Accept Qatar's Plane Gift";
const JET_FC = "FactCheck.org: Unwrapping Qatar's $400 Million";
const JET_EISEN = "Yahoo News (The Hill): Qatar jet 'obviously'";
const JET_SCHUMER = 'Senate Democrats: Following The Largest Foreign Bribe';
const JET_FLIGHT = 'NPR: Trump takes first flight on new Air Force One';
const OCC = 'Office of the Comptroller of the Currency: Corporate Decision #1385';
const OCC_CNBC = 'CNBC: Trump family-backed crypto firm World Liberty gets conditional';
const OCC_FOX = 'Fox Business: Trump-linked World Liberty crypto venture gets preliminary';
const WARREN_BANK = 'Senate Banking Committee Minority: Ahead of Senate Crypto Vote';
const ROLLCALL = 'U.S. Senate: Roll Call Vote 234';
const AP_CRYPTO = 'AP: Senate blocks cryptocurrency regulation';
const VULCAN = 'ProPublica: The White House Intervened';
const VULCAN_CATO = 'Cato Institute: White House Intervention Bolsters';
const PRISON = 'CREW: Trump has made 29 private prison stock trades';
const PRISON_NPR = 'NPR: Private prisons announce $1.4 billion';

// ── The ledger. `form` rows are exact income figures from the 2025 filing (the line numbers are
// the filing's own); the page totals only those. Everything else is shown, never added in.
const ledger = [
  // Crypto ventures that carry his name
  { id: 'meme', group: 'crypto', form: true, when: '2025', item: 'Meme-coin royalties', payer: 'A license agreement with "Celebration Coins," through CIC Digital LLC', line: 'Line 21.6', amount: 635068835,
    note: 'The single largest line on the form. The $TRUMP coin launched three days before the inauguration; by July 2026, 988,905 wallets had lost a combined $3.81 billion on it, including paper losses.', sources: srcs(OGE, MEME_NYT) },
  { id: 'wlf-tokens', group: 'crypto', form: true, when: '2025', item: 'World Liberty Financial token sales', payer: 'Buyers of WLFI tokens, through DT Marks Defi LLC', line: 'Lines 124.3–124.12', amount: 526810321,
    note: 'Proceeds distributed by World Liberty, the crypto company his family launched in September 2024. His 2024 disclosure had shown just over $57 million from token sales.', sources: srcs(OGE, TIME_DISC, TNR_DISC) },
  { id: 'wlf-equity', group: 'crypto', form: true, when: '2025', item: 'Sale of World Liberty equity', payer: 'Buyers of a stake in WLF Holdco LLC', line: 'Line 124.2', amount: 65625000,
    note: 'Four days before the inauguration, a firm backed by the UAE\'s national security adviser agreed to buy 49 percent of World Liberty for $500 million.', sources: srcs(OGE, UAE_CNN) },
  { id: 'stablecoin', group: 'crypto', form: true, when: '2025', item: 'Stablecoin Holdco proceeds', payer: 'New members of Stablecoin Holdco LLC, which the form calls his "Stablecoin business"', line: 'Line 114', amount: 196875000,
    note: 'Net proceeds from new members\' capital contributions and a sale of interests.', sources: srcs(OGE, TIME_DISC) },
  { id: 'crypto-other', group: 'crypto', form: true, when: '2025', item: 'Other crypto lines', payer: 'The stablecoin business, staking rewards and wallet interest', line: 'Lines 21, 124, 204', amount: 11206037,
    note: 'Smaller crypto income on the same form.', sources: srcs(OGE) },

  // Licensing his name to foreign developers
  { id: 'lic-uae', group: 'licensing', form: true, when: '2025', item: 'United Arab Emirates', payer: 'Developers in Dubai and Abu Dhabi', line: 'Lines 51, 63, 65, 79, 81', amount: 22951342.68,
    note: 'License fees for Trump-branded projects.', sources: srcs(OGE) },
  { id: 'lic-ksa', group: 'licensing', form: true, when: '2025', item: 'Saudi Arabia', payer: 'Dar Global, a developer tied to the Saudi government', line: 'Line 94', amount: 9243574.15,
    note: 'Dar Global\'s projects with the Trump Organization include a roughly $1 billion tower in Jeddah announced in September 2025.', sources: srcs(OGE, GULF_MEE) },
  { id: 'lic-qatar', group: 'licensing', form: true, when: '2025', item: 'Qatar', payer: 'A Doha project with Dar Global and Qatari Diar, "a company owned by the Qatari government"', line: 'Line 77', amount: 5250000,
    note: 'Announced weeks before his May 2025 Gulf trip. The Trump Organization\'s ethics pledge "explicitly bars partnerships with foreign governments"; it told the AP its agreement was solely with the Saudi firm.', sources: srcs(OGE, GULF_NW, GULF_EME) },
  { id: 'lic-india', group: 'licensing', form: true, when: '2025', item: 'India', payer: 'Developers in Gurgaon, Hyderabad, Noida, Pune, Worli and Kolkata', line: 'Lines 87, 89, 91, 104, 112, 118, 126', amount: 10210685,
    note: 'License fees for Trump-branded towers.', sources: srcs(OGE) },
  { id: 'lic-other', group: 'licensing', form: true, when: '2025', item: 'Romania, Vietnam, the Philippines, Oman and Turkey', payer: 'Developers in five more countries', line: 'Lines 71, 106, 108, 116, 322, 332', amount: 13117251,
    note: 'The Trump Organization did not pursue new foreign deals during his first term.', sources: srcs(OGE, TIME_DISC) },

  // Settlements with companies (most marked as paid elsewhere)
  { id: 'set-x', group: 'settlements', form: true, when: 'Feb 2025', item: 'X', payer: 'X Corp., over his 2021 suspension', line: 'Line 431.1', amount: 8000000,
    note: 'The only settlement the form does not mark as paid to someone else. Its owner, Elon Musk, was then running the administration\'s cost-cutting effort.', sources: srcs(OGE, X_SETTLE) },
  { id: 'set-abc', group: 'settlements', form: true, when: 'Dec 2024', item: 'ABC', payer: 'ABC, over a George Stephanopoulos broadcast', line: 'Line 431.2', amount: 16000000, recipient: 'His library foundation',
    note: 'Settled before he took office. Marked as paid to the Donald J. Trump Presidential Library Foundation.', sources: srcs(OGE, ABC_SETTLE, ABC_CNN) },
  { id: 'set-meta', group: 'settlements', form: true, when: 'Jan 2025', item: 'Meta', payer: 'Meta, over his suspension after January 6', line: 'Line 431.4', amount: 24500000, recipient: 'His library foundation',
    note: 'Meta also faced a Federal Trade Commission antitrust case headed for trial.', sources: srcs(OGE, META, META_FTC) },
  { id: 'set-cbs', group: 'settlements', form: true, when: 'Jul 2025', item: 'CBS (Paramount)', payer: 'Paramount, over a "60 Minutes" interview', line: 'Line 431.3', amount: 16000000, recipient: 'His library foundation',
    note: 'Paramount was waiting for FCC approval of its Skydance merger, which came three weeks later.', sources: srcs(OGE, PARA_CBS, FCC) },
  { id: 'set-yt', group: 'settlements', form: true, when: 'Sep 2025', item: 'YouTube (Alphabet)', payer: 'Alphabet, over his suspension after January 6', line: 'Line 431.5', amount: 22000000, recipient: 'The Trust for the National Mall',
    note: 'Paid toward his White House ballroom. Google was awaiting a Justice Department decision on appealing its search-monopoly ruling.', sources: srcs(OGE, YT_CBS, PICHAI) },

  // Businesses he already owned
  { id: 'mal', group: 'business', form: true, when: '2025', item: 'Mar-a-Lago', payer: 'Members and guests', line: 'Line 180', amount: 77482488,
    note: 'Up from $50 million in 2024. Gross revenue, not profit.', sources: srcs(OGE, TIME_DISC) },
  { id: 'business', group: 'business', form: true, when: '2025', item: 'Golf clubs, resorts, hotels and other businesses', payer: 'Customers of businesses he owned before 2025', line: 'Part 2, by our count', amount: 489244385.55,
    note: 'Gross revenue, not profit. Time reported that revenue at his golf courses and resorts rose 15 percent in 2025.', sources: srcs(OGE, TIME_DISC) },
  { id: 'royalties', group: 'business', form: true, when: '2025', item: 'Royalties at home', payer: 'Trump Watches, books, a Bible, sneakers and a guitar', line: 'Lines 24.2–24.8 and others', amount: 8429835,
    note: 'Including $4.7 million from Trump Watches.', sources: srcs(OGE, CNBC_DISC) },

  // Around his family's ventures, not on his form as income
  { id: 'mgx', group: 'around', when: 'May 2025', item: 'A $2 billion Emirati investment in Binance, closed in World Liberty\'s stablecoin', payer: 'MGX, an Abu Dhabi state-backed fund chaired by the UAE\'s national security adviser', amount: 2000000000,
    note: 'Not paid to World Liberty. Its value to World Liberty is the interest on the reserves behind the coins, which Fortune estimated could reach $80 million a year.', sources: srcs(MGX_ABC, MGX_FORTUNE) },
  { id: 'jet', group: 'around', when: 'May 2025', item: 'A Boeing 747-8 from Qatar\'s government', payer: 'The government of Qatar', amount: 400000000, approx: true,
    note: 'Accepted by the Defense Department to fly as Air Force One; Trump has said it will go to his library. Valued at about $400 million if new.', sources: srcs(JET_NPR, JET_FC) },
  { id: 'vulcan', group: 'around', when: 'Nov 2025', item: 'A Pentagon loan commitment to Vulcan Elements', payer: 'The Defense Department, at the White House\'s initiative', amount: 620000000,
    note: 'Donald Trump Jr.\'s venture firm, 1789 Capital, had invested in Vulcan in August 2025.', sources: srcs(VULCAN, VULCAN_CATO) },
];

const dive = {
  slug: 'his-own-account',
  updated: '2026-09-25',
  trackerIds: IDS,
  section: 'corruption',
  meta: {
    kicker: 'Profit',
    title: 'By His Own Account',
    dek: 'Is he profiting from the office? His own financial disclosure answers most of it. Line by line: what came in during his first year back, where it came from, and who was paying.',
    status: 'His next disclosure is due May 15, 2027',
    statusText: 'The 2025 disclosure, released June 30, 2026, is the latest. It shows money through December 2025. In July 2026 the Senate Banking Committee\'s ranking Democrat asked him to release an updated report; none is on the record, and he is not required to file again until May 15, 2027. His family\'s crypto company won preliminary approval for a federal trust bank charter in August 2026.',
    formNote: 'Exact dollar figures from the income column of his 2025 financial disclosure, grouped and added by us.',
  },
  hero: {
    question: 'Is he profiting from the office?',
    answer: 'His own financial disclosure lists about $2.16 billion coming in during 2025, his first year back. About $1.44 billion of it came from crypto ventures that carry his name and were launched during or after his 2024 campaign. Some of the money traces to a firm tied to a foreign government\'s security chief and to companies with business before his administration.',
    rule: 'The president must disclose his finances but, unlike his appointees, is not bound by the conflict-of-interest rules. The Constitution\'s Foreign Emoluments Clause bars any federal officeholder from accepting a present or emolument from a foreign state without the consent of Congress. No court has applied either to anything on this page.',
    ruleSources: srcs(TIME_DISC, JET_FC),
    deck: [
      'On June 30, 2026, the Office of Government Ethics released his annual financial disclosure for 2025. It runs 927 pages. It lists what came in: royalties from a meme coin launched three days before the inauguration, proceeds from his family\'s crypto company, license fees from developers in the Gulf and India, settlements from media companies, and revenue from the golf clubs and resorts he already owned.',
      'Below: the ledger, drawn from the filing line by line; the record in order, including who bought in and what they had before the government; the explanations set against the documents; who objected and who defended it; the rules that apply; and what to watch. Every fact is sourced. Every opinion is labeled.',
    ],
    quote: {
      lead: 'A presidential historian, on the disclosure:',
      text: 'There is no precedent to compare it with. No president in the 20th or 21st century has had something that\'s vaguely comparable.',
      cite: 'Douglas Brinkley, Rice University, June 2026',
      sources: srcs(NBC_DISC),
    },
  },
  ledger,

  days: [
    { date: '2024-09-16', events: [
      { actor: 'wh', title: 'World Liberty Financial debuts', trackerIds: ['world-liberty-financial-crypto'],
        body: ['Announced by Eric Trump in August, the family\'s crypto company debuted in a livestream on X with Trump, his sons and business partners, seven weeks before the election. It sells a governance token, WLFI, and later a stablecoin, USD1. Barron Trump, then 18, was named its "DeFi visionary."'],
        sources: srcs(WLF_CNBC, WLF_CBS, WLF_DECRYPT) },
    ] },
    { date: '2024-11-25', events: [
      { actor: 'payer', title: 'Justin Sun buys $30 million of World Liberty tokens', trackerIds: ['world-liberty-financial-crypto', 'trump-meme-coin-dinner-top-holders-virginia-club'],
        body: ['The crypto entrepreneur announced the purchase three weeks after the election. The Securities and Exchange Commission was then pursuing a civil fraud case against him.'],
        sources: srcs(WLF_SUN, SUN_PAUSE) },
    ] },
    { date: '2024-12-14', events: [
      { actor: 'payer', title: 'ABC settles for $15 million toward his library', trackerIds: ['media-tech-settlements-86-million-trump-library-ballroom'],
        body: ['ABC agreed to pay $15 million as a "charitable contribution" toward a future presidential foundation and museum, plus $1 million in legal fees, over George Stephanopoulos\'s on-air statement that Trump was "found liable for rape." The jury had found him liable for sexual abuse.'],
        sources: srcs(ABC_SETTLE, ABC_AP, ABC_CNN) },
    ] },
    { date: '2025-01-16', events: [
      { actor: 'payer', title: 'A UAE-backed firm buys 49% of World Liberty', trackerIds: ['uae-royal-crypto-investment'],
        body: ['Four days before the inauguration, Aryam Investment, backed by Sheikh Tahnoon bin Zayed, the UAE\'s national security adviser, agreed to pay $500 million for 49 percent of the company. Eric Trump signed the deal. The buyers paid up front, "with $187 million going to Trump family entities and at least $31 million going to Witkoff family entities." The Wall Street Journal reported the deal a year later.'],
        sources: srcs(UAE_CNN, UAE_CNBC, DAILY_CALLER) },
    ] },
    { date: '2025-01-17', events: [
      { actor: 'wh', title: 'Three days before the inauguration, the $TRUMP coin', trackerIds: ['trump-meme-coin'],
        body: ['Trump launched a meme coin. Two companies, one of them a Trump Organization affiliate, "collectively own 80%" of the supply, and CIC Digital and its partner "will receive trading revenue," according to the coin\'s website. The token\'s value "initially soared to $15 billion," then lost most of it within days.'],
        sources: srcs(MEME_CNN, MEME_SENATE, MEME_CNBC) },
    ] },
    { date: '2025-01-20', events: [
      { actor: 'wh', title: 'Inauguration, without a blind trust', trackerIds: ['trump-2025-financial-disclosure-2-billion-crypto-earnings'],
        body: ['He did not divest or place his assets in a blind trust, as recent predecessors did. They sit in a revocable trust overseen by Donald Trump Jr., which he can amend or revoke.'],
        sources: srcs(TIME_DISC, INDY_DISC) },
    ] },
    { date: '2025-01-29', events: [
      { actor: 'payer', title: 'Meta settles for $25 million', trackerIds: ['media-tech-settlements-86-million-trump-library-ballroom'],
        body: ['Meta agreed to pay $25 million over his suspension after January 6, most of it toward the library. It also faced a Federal Trade Commission antitrust case headed for an April trial that could force it to unwind its purchases of Instagram and WhatsApp.'],
        sources: srcs(META, META_FTC) },
    ] },
    { date: '2025-02-12', events: [
      { actor: 'payer', title: 'X settles', trackerIds: ['media-tech-settlements-86-million-trump-library-ballroom'],
        body: ['X agreed to pay about $10 million, according to reports citing one person familiar with it; the disclosure lists $8 million. Its owner, Elon Musk, was running the administration\'s cost-cutting effort. "It\'s resolved," Trump\'s lawyer said.'],
        sources: srcs(X_SETTLE) },
    ] },
    { date: '2025-02-26', events: [
      { actor: 'wh', title: 'The SEC asks to pause its case against Justin Sun', trackerIds: ['trump-meme-coin-dinner-top-holders-virginia-club'],
        body: ['The Securities and Exchange Commission and Sun asked a court to pause the fraud case while they considered a resolution. It was settled in March 2026 with a $10 million penalty paid by his company.'],
        sources: srcs(SUN_PAUSE, SUN_SEC) },
    ] },
    { date: '2025-04-08', events: [
      { actor: 'wh', title: 'The Justice Department shuts its crypto enforcement team', trackerIds: ['world-liberty-financial-crypto'],
        body: ['A memo from Deputy Attorney General Todd Blanche shut down the National Cryptocurrency Enforcement Team.'],
        sources: srcs(NCET) },
    ] },
    { date: '2025-05-01', events: [
      { actor: 'payer', title: 'An Emirati fund\'s $2 billion Binance deal closes in World Liberty\'s coin', trackerIds: ['uae-royal-crypto-investment'],
        body: ['At a crypto conference in Dubai, World Liberty\'s Zach Witkoff announced, "We are excited to announce today that USD1 has been selected as the official stablecoin to close MGX\'s $2 billion investment in Binance." MGX is chaired by the same UAE security chief behind the World Liberty stake. World Liberty earns the interest on its stablecoin\'s reserves, which Fortune estimated "could net as much as $80 million over a year."'],
        sources: srcs(MGX_ABC, MGX_FORTUNE) },
    ] },
    { date: '2025-05-15', events: [
      { actor: 'wh', title: 'The UAE gets its AI campus', trackerIds: ['uae-royal-crypto-investment'],
        body: ['Two weeks later the White House announced a 5-gigawatt AI campus in Abu Dhabi to be built by G42, the state AI firm the same official heads. In November the administration authorized G42 to buy advanced Nvidia chips. No reporting shows the investments and the approvals were linked: "There\'s no evidence that the chips are related to the two billion in World Liberty crypto," 60 Minutes reported.'],
        sources: srcs(AI_CAMPUS, CHIPS, SIXTY) },
    ] },
    { date: '2025-05-21', events: [
      { actor: 'wh', title: 'A 747 from Qatar\'s government', trackerIds: ['qatar-plane-bribe'],
        body: ['The Defense Department accepted a Boeing 747-8 from the government of Qatar to fly as Air Force One; Trump has said he wants to keep it in his presidential library after leaving office. "Only a FOOL would not accept this gift on behalf of our country," he posted.'],
        sources: srcs(JET_NPR, JET_TIME) },
    ] },
    { date: '2025-05-22', events: [
      { actor: 'wh', title: 'Dinner for the coin\'s biggest buyers', trackerIds: ['trump-meme-coin-dinner-top-holders-virginia-club'],
        body: ['Trump attended a dinner at his Virginia golf club for the 220 largest holders of his meme coin, who had spent "a combined $148 million on the token for the chance to be there." The top holder was Justin Sun. The White House said, "The president is attending it in his personal time. It is not a White House dinner."'],
        sources: srcs(DIN_CNBC, DIN_CNN, DIN_TIME) },
    ] },
    { date: '2025-05-29', events: [
      { actor: 'wh', title: 'The SEC drops its Binance case', trackerIds: ['trump-pardons-binance-founder-changpeng-zhao'],
        body: ['The Securities and Exchange Commission dismissed its civil case against Binance and its founder, Changpeng Zhao, "in the exercise of its discretion and as a policy matter."'],
        sources: srcs(SEC_BINANCE) },
    ] },
    { date: '2025-07-01', events: [
      { actor: 'payer', title: 'Paramount settles, with its merger before the FCC', trackerIds: ['media-tech-settlements-86-million-trump-library-ballroom'],
        body: ['Paramount agreed to pay $16 million toward the library over a "60 Minutes" interview with Kamala Harris; the unedited footage had confirmed she was accurately quoted. FCC Chair Brendan Carr said the settlement had "nothing to do with the work that we\'re doing at the FCC." Commissioner Anna Gomez called it "a desperate move to appease the Administration and secure regulatory approval of a major transaction currently pending before the FCC." The FCC approved the Skydance merger on July 24.'],
        sources: srcs(PARA_CBS, PARA_NBC, PARA_LAT, CARR, FCC) },
    ] },
    { date: '2025-09-29', events: [
      { actor: 'payer', title: 'YouTube settles, and the money goes to the ballroom', trackerIds: ['media-tech-settlements-86-million-trump-library-ballroom'],
        body: ['YouTube agreed to pay $24.5 million: $22 million to the Trust for the National Mall for his White House ballroom. Weeks earlier Google\'s chief executive had thanked the administration for its "constructive dialogue" after a ruling in the Justice Department\'s search case against Google. Trump posted, "This MASSIVE victory proves Big Tech censorship has consequences."'],
        sources: srcs(YT_CBS, YT_CNN, YT_NPR, PICHAI) },
      { actor: 'payer', title: 'A $1 billion Trump tower in Jeddah', trackerIds: ['trump-organization-dar-global-saudi-qatar-gulf-deals'],
        body: ['Dar Global, a developer tied to the Saudi government, announced a roughly $1 billion Trump Plaza in Jeddah. Its chief executive later said its projects with the Trump Organization are valued together at around $10 billion.'],
        sources: srcs(GULF_PBS, GULF_MEE) },
    ] },
    { date: '2025-10-21', events: [
      { actor: 'wh', title: 'He pardons Binance\'s founder', trackerIds: ['trump-pardons-binance-founder-changpeng-zhao'],
        body: ['Trump signed a "full and unconditional pardon" for Changpeng Zhao, who had pleaded guilty to anti-money-laundering violations; Binance had paid more than $4.3 billion. That spring, an Emirati fund\'s $2 billion investment in Binance had been closed in World Liberty\'s stablecoin. Asked about it on 60 Minutes, Trump said, "I don\'t know who he is." Zhao: "There\'s no deal, there has never been any discussions."'],
        sources: srcs(PARDON_DOJ, PARDON_CNBC, PARDON_WAPO, PARDON_FOXBIZ, DONT_KNOW, ZHAO_FOX) },
    ] },
    { date: '2025-11-15', month: true, events: [
      { actor: 'wh', title: 'A $620 million Pentagon loan commitment to a company Trump Jr.\'s firm backs', trackerIds: ['trump-jr-vulcan-elements-620m-pentagon-loan-navarro'],
        body: ['The Pentagon announced a $620 million loan commitment to Vulcan Elements, a rare-earth magnet startup that 1789 Capital, the firm where Donald Trump Jr. is a partner, had invested in three months earlier. ProPublica later reported that the White House initiated it: "The call came from the White House: We have to get this done," a person involved said.'],
        sources: srcs(VULCAN, VULCAN_CATO) },
    ] },
    { date: '2026-06-30', events: [
      { actor: 'wh', title: 'The disclosure', trackerIds: ['trump-2025-financial-disclosure-2-billion-crypto-earnings'],
        body: ['The Office of Government Ethics released the 927-page filing. Because many amounts are ranges, NBC noted, "it is impossible to state exactly how much Trump earned last year." The Trump Organization: it "demonstrates a level of financial transparency unmatched in presidential history."'],
        sources: srcs(OGE, NBC_DISC, CNBC_DISC) },
    ] },
    { date: '2026-07-01', events: [
      { actor: 'wh', title: '"The blind account"', trackerIds: ['trump-2025-financial-disclosure-2-billion-crypto-earnings', 'qatar-plane-bribe'],
        body: ['Asked about the windfall as he boarded the Qatari jet on its first flight as Air Force One, Trump said he does not "get involved" in his finances: "I\'ve made a lot of money before I became president, and they invest my money, and I don\'t talk to them." He called it "the blind account."'],
        sources: srcs(INDY_DISC, JET_FLIGHT) },
    ] },
    { date: '2026-08-14', events: [
      { actor: 'wh', title: 'A trust bank charter for his family\'s crypto company', trackerIds: ['world-liberty-financial-occ-bank-charter-bid-usd1-ufc'],
        body: ['The Office of the Comptroller of the Currency, led by a Trump appointee, granted World Liberty Trust Co. preliminary conditional approval for a national trust bank charter. Sen. Elizabeth Warren: "Donald Trump is now the first President in history to own and oversee his own bank."'],
        sources: srcs(OCC, OCC_CNBC, OCC_FOX, WARREN_BANK) },
    ] },
    { date: '2026-09-15', events: [
      { actor: 'congress', title: 'The Senate stalls the crypto bill over ethics limits', trackerIds: ['world-liberty-financial-occ-bank-charter-bid-usd1-ufc'],
        body: ['The Senate voted 49-50 against advancing the crypto market structure bill, with four Republicans opposed. Democrats wanted stricter enforcement and a requirement for the president to divest crypto holdings; last year\'s stablecoin law, the AP noted, "did not extend to Trump or his family."'],
        sources: srcs(ROLLCALL, AP_CRYPTO) },
    ] },
  ],

  claims: [
    { claim: 'I\'ve made a lot of money before I became president, and they invest my money, and I don\'t talk to them.', who: 'Trump, July 1, 2026',
      found: 'The largest items on the form are not managed investments. They are ventures that carry his name.',
      detail: 'Meme-coin royalties and World Liberty proceeds account for most of the $1.44 billion in crypto income on the form. He has not placed his assets in a blind trust; they sit in a revocable trust overseen by Donald Trump Jr., which he can amend or revoke.',
      sources: srcs(OGE, TIME_DISC, INDY_DISC) },
    { claim: 'because the stock market\'s going up', who: 'Trump, explaining why he is profiting',
      found: 'Stock gains are not what drives the total.',
      detail: 'The form reports his stock trades only in ranges; the exact figures that add up to about $2.16 billion are crypto proceeds, business revenue, license fees and settlements.',
      sources: srcs(OGE, NBC_DISC, TIME_DISC) },
    { claim: 'Neither the President nor his family has ever engaged—or will ever engage—in conflicts of interest.', who: 'The White House, in a statement on the disclosure',
      found: 'The conflict-of-interest rules do not apply to him, and his largest source of income is an industry his administration regulates.',
      detail: 'The president and vice president "are not subject to the ethics laws that prohibit conflicts of interest among most executive branch employees," Time noted. His administration shut down the Justice Department\'s crypto enforcement team, the SEC dropped its Binance case, and a regulator he appointed granted preliminary approval for a bank charter for his family\'s crypto company.',
      sources: srcs(TIME_DISC, NCET, SEC_BINANCE, OCC_CNBC) },
    { claim: 'At nearly 1,000 pages, it represents one of the most comprehensive financial disclosure reports ever submitted and demonstrates a level of financial transparency unmatched in presidential history.', who: 'The Trump Organization',
      found: 'Much of it cannot be totaled, and some of it was late.',
      detail: 'Many amounts are reported as ranges, which NBC noted makes it "impossible to state exactly how much Trump earned last year." The filing says he paid late filing fees for transactions not previously reported. The largest single line names a licensee, "Celebration Coins," for which NBC could find no digital footprint.',
      sources: srcs(NBC_DISC, CNBC_DISC) },
    { claim: 'Any claim that this deal had anything to do with the Administration\'s actions on chips is 100% false.', who: 'World Liberty Financial, on the UAE-backed stake',
      found: 'No reporting links the stake to the chip approvals. The record shows the order of events.',
      detail: 'The stake was signed four days before the inauguration while the buyer\'s patron was seeking advanced AI chips; the White House announced a UAE AI campus two weeks after the stablecoin deal; approvals for G42 followed in November. "There\'s no evidence that the chips are related to the two billion in World Liberty crypto," 60 Minutes reported.',
      sources: srcs(UAE_CNN, AI_CAMPUS, CHIPS, SIXTY) },
  ],

  voices: {
    objected: [
      { who: 'Richard Stengel', role: 'Under secretary of state under Obama, on the UAE stake', quote: 'Never before has a foreign government official taken a major ownership stake in an incoming U.S. president\'s company.', sources: srcs(UAE_CNN) },
      { who: 'Sen. Cynthia Lummis', role: 'Republican of Wyoming, a longtime advocate for digital assets, on the meme-coin dinner', quote: 'This is my President we\'re talking about, but I am willing to say that this gives me pause.', sources: srcs(DIN_TIME) },
      { who: 'Rep. French Hill', role: 'Republican of Arkansas, then leading negotiations on the stablecoin bill', quote: 'The Trump family activity in the memecoin space makes my work in Congress more complicated.', sources: srcs(DIN_CNBC) },
      { who: 'Anna Gomez', role: 'FCC commissioner, on the Paramount settlement', quote: 'a desperate move to appease the Administration and secure regulatory approval of a major transaction currently pending before the FCC', sources: srcs(PARA_NBC) },
      { who: 'Sen. Chris Murphy', role: 'Democrat of Connecticut, on the meme coin', quote: 'the single most corrupt act ever committed by a president', sources: srcs(MURPHY) },
    ],
    defended: [
      { who: 'Anna Kelly', role: 'White House spokesperson, on the UAE stake', quote: 'President Trump\'s assets are in a trust managed by his children. There are no conflicts of interest.', sources: srcs(UAE_CNN) },
      { who: 'Trump', role: 'On boarding the new Air Force One, July 1, 2026', quote: 'I\'ve made a lot of money before I became president, and they invest my money, and I don\'t talk to them.', sources: srcs(INDY_DISC) },
      { who: 'Trump', role: 'After the second meme-coin event, April 2026', quote: 'As a president, I have to be able to make sure that all of our industries do well.', sources: srcs(MAL) },
      { who: 'Brendan Carr', role: 'FCC chair, on the Paramount settlement', quote: 'nothing to do with the work that we\'re doing at the FCC', sources: srcs(CARR) },
      { who: 'Changpeng Zhao', role: 'Binance founder, on his pardon', quote: 'There\'s no deal, there has never been any discussions. It\'s as simple as that.', sources: srcs(ZHAO_FOX) },
    ],
  },

  rules: [
    { label: 'Art. I, Sec. 9', name: 'The Foreign Emoluments Clause', body: 'The Constitution bars anyone holding federal office from accepting any present or emolument from a foreign state without the consent of Congress. Democratic lawmakers and watchdogs say the Qatari jet violates it. A legal expert told FactCheck.org a gift to the government for use as Air Force One would be legal, but donating it to his library would not. No court has ruled on the jet.', sources: srcs(JET_NPR, JET_FC, JET_EISEN) },
    { label: 'Ethics law', name: 'Conflict-of-interest rules', body: 'The president and vice president must disclose their finances, but "are not subject to the ethics laws that prohibit conflicts of interest among most executive branch employees," Time noted. Recent presidents placed their assets in blind trusts; he has not.', sources: srcs(TIME_DISC, INDY_DISC) },
    { label: 'Annually', name: 'The disclosure itself', body: 'The form reports much of what it covers in ranges, not exact amounts, so no one can total what he earned; the exact figures on this page are the ones the form states. It covers the calendar year: the 2025 report, released in June 2026, is the most recent, and the next is due May 15, 2027.', sources: srcs(NBC_DISC, BANKING_LETTER) },
  ],

  watch: [
    { date: '2027-05-15', when: 'May 15, 2027', title: 'The next disclosure', text: 'His report for 2026 is due. It will show the year the family\'s crypto bank charter was approved and the second meme-coin event was held.', sources: srcs(BANKING_LETTER) },
    { when: 'Open', title: 'The crypto market structure bill', text: 'Stalled in the Senate on September 15, 2026, with Democrats seeking a requirement that the president divest crypto holdings.', sources: srcs(AP_CRYPTO) },
    { when: 'Open', title: 'World Liberty\'s bank', text: 'The OCC\'s approval is preliminary and conditional; the bank cannot open until it meets the conditions.', sources: srcs(OCC) },
    { when: 'Open', title: 'Where the settlement money went', text: 'Democratic senators have asked his library foundation to account for the settlement money. No answer is on the record.', sources: srcs(LIB_WARREN) },
  ],

  take: [
    'The disclosure answers the question it was built to answer. Yes: he is making money while in office, a great deal of it, and most of the new money comes from ventures that exist because of his name and his politics. The largest single line is a royalty from a meme coin launched three days before he took the oath, and the second-largest block is his family\'s crypto company, in an industry his administration now regulates, shields and charters.',
    'None of this has been shown to be a bribe, and this page does not say it is. What the record shows is a president who kept his businesses, took money from buyers he cannot or will not name, and set policy for the people paying. The rules that bind every one of his appointees were written on the assumption that a president would not need them. That assumption is the gap.',
    'The defense is that it is all disclosed. It is disclosed after the fact, in ranges, a year late for anything that matters, and with a "Celebration Coins" at the top that no reporter has been able to find. Disclosure is where accountability starts. It is not where it ends.',
  ],

  corrections: [
    { date: '2026-09-25', text: 'Before this page was published, the tracker entries it draws on were checked against their sources and the filing itself. The disclosure entry had called the $2 billion total money he "made" (it includes gross business revenue), attributed two figures to a Bloomberg article we could not read, misdated his remarks, and misread a trade count; a first recount of the filing also missed amounts written with cents. The UAE entries dated the stake a year late and treated the Emirati fund\'s $2 billion Binance investment as money World Liberty received. The meme-coin entry called royalties "fees." The World Liberty entry\'s $11.6 billion headline figure was in none of its sources. The Qatari jet entry attributed a press-release headline to an ethics lawyer. The Gulf deals, Vulcan loan, bank charter and prison-stock entries had misdated events, overstated causation or presented anonymous claims as findings. All were corrected in the tracker first, with notes, and new entries were added for the settlements, the Binance pardon and the meme-coin dinner.' },
  ],
};

// Sanity: the ledger's form rows must add up to the filing's exact-dollar total.
const formTotal = ledger.filter((r) => r.form).reduce((n, r) => n + r.amount, 0);
if (Math.abs(formTotal - 2158014754.38) > 0.01) throw new Error(`form rows total ${formTotal}, expected 2158014754.38`);

fs.writeFileSync(OUT, JSON.stringify(dive, null, 2) + '\n');
const n = [...JSON.stringify(dive).matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
console.log('wrote', OUT, '|', dive.days.reduce((k, d) => k + d.events.length, 0), 'events |', new Set(n).size, 'unique sources | form total', formTotal.toFixed(2));
