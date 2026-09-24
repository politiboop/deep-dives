// Builds src/data/paid-for.json from its seed tracker entries (run: node scripts/build-paid-for.cjs).
// Every source is pulled from a seed entry by a unique substring of its text, so no
// URL on the page is typed by hand. S() throws on zero or multiple matches.
const fs = require('fs');
const path = require('path');
const TRACKER = path.join(__dirname, '..', '..', 'controversial-trump', 'data', 'controversies') + '/';
const OUT = path.join(__dirname, '..', 'src', 'data', 'paid-for.json');
const IDS = [
  'trump-ad-fox-news-paid-for-by-the-us-government',
  'white-house-launches-trump-tv-24-7-stream-after-press-ban',
  'white-house-app-forced-federal-employee-phones',
  'white-house-app-cryptic-videos-ice-tipline',
  'trump-face-federal-building-banners',
  'trump-banner-doj-building',
  'schiff-trump-banners-153k-propaganda-contracts',
  'white-house-ballroom-donor-funded',
  'ballroom-architect-mccrery-quit-fire-exits-i-am-the-code',
  'gop-taxpayer-funding-trump-ballroom-graham-schmitt-britt',
  'republican-72-billion-ice-bill-1-billion-trump-ballroom',
  'senate-parliamentarian-strikes-1-billion-ballroom-security-funding-byrd-rule',
  'ballroom-donors-50-billion-federal-contracts-public-citizen',
  'trump-monuments-nobody-will-do-it-once-im-gone',
  'noem-fired-dhs-ad-scandal',
];
const pool = new Map();
for (const id of IDS) for (const s of JSON.parse(fs.readFileSync(TRACKER + id + '.json', 'utf8')).sources) if (!pool.has(s.url)) pool.set(s.url, s);
function S(needle) {
  const hits = [...pool.values()].filter((s) => s.text.includes(needle));
  if (hits.length !== 1) throw new Error(`S(${JSON.stringify(needle)}) matched ${hits.length} sources`);
  return { text: hits[0].text, url: hits[0].url };
}
const srcs = (...needles) => needles.map(S);

// Source handles, by outlet and story.
const AP_AD = 'Associated Press: US government foots bill';
const ABC_AD = 'ABC News, Associated Press wire';
const INDY_AD = 'The Independent: Trump commercial';
const AJ_LEON = 'Al Jazeera (Reuters): Judge temporarily halts';
const SPECTRUM_LEON = 'Spectrum News (Associated Press)';
const WAPO_AD = "Washington Post: Trump ad airing";
const MEDIAITE_AD = "Mediaite: 'Absolutely Orwellian!'";
const HUFF_AD = "HuffPost: 'Fascist Propaganda";
const WH_VIDEO = 'The White House: America Will Never Be';
const NOTUS_TV = 'NOTUS: Days After Press Ban';
const NEWSWEEK_TV = 'Newsweek: White House Launches Trump TV';
const BREITBART_TV = 'Breitbart: White House Launches Trump TV';
const TIME_TV = "Time: White House Launches 'Trump TV'";
const BARRETT_TV = 'Barrett Media';
const GOVEXEC_APP = 'Government Executive: The White House is ordering';
const ENGADGET_APP = 'Engadget';
const RAW_APP = 'Raw Story: White House app';
const CNBC_APP = "CNBC: White House launches app";
const HILL_APP = 'The Hill: White House launches smartphone app';
const AXIOS_BAN = 'Axios DC';
const SCHIFF_BAN = 'Sen. Schiff - Exposes';
const CNN_BAN25 = 'CNN - Massive banners';
const WEX_BAN = 'Washington Examiner - Thousands';
const CNN_DOJBAN = 'CNN: Giant banner of Donald Trump';
const AP_DOJBAN = 'AP/Click On Detroit';
const MEDIAITE_DOJBAN = "Mediaite: '1930s Germany Vibes'";
const INDY_BAN = "The Independent: Trump's giant banners";
const EE_BAN = 'Politico / E&E News';
const BEAST_BAN = 'The Daily Beast: Jaw-Dropping';
const NBC_DONORS = 'NBC News: Trump vowed to identify';
const CNN_DONORS = 'CNN: White House releases list of donors';
const NPR_APPEAL = 'NPR: D.C. appeals court';
const CNN_APPEAL = 'CNN: Appeals court allows';
const AJ_MOTION = 'Al Jazeera: Trump files emergency motion';
const WAPO_ARCH = "Washington Post: 'I am the code'";
const PEOPLE_ARCH = 'People: Architect';
const RD_ARCH = 'The Real Deal';
const INDY_GOP = "The Independent: Republicans now plan";
const WAPO_TRACK = 'Washington Post: Tracking';
const RC_SS = 'Roll Call: Secret Service disbursements';
const HUFF_ICE = 'HuffPost: Republicans push $72 billion';
const BBC_BYRD = 'BBC News: Trump';
const POL_BYRD = 'Politico: Ballroom won';
const WAPO_PC = 'Washington Post: Ballroom donors won';
const MEDIAITE_PC = 'Mediaite: Corporate Donors';
const TNR_PC = "The New Republic: Trump's Ballroom Donors";
const CNN_MON = "CNN: Trump says 'nobody will'";
const TNR_MON = 'The New Republic: Trump reveals why';
const NBC_NOEM = 'NBC News: Trump fires Kristi Noem';
const PP_NOEM = 'ProPublica: Kristi Noem-Tied Firm';
const HILL_NOEM = "The Hill: Noem faces GOP heat";

// ── The ledger: what each item costs, and who pays. amount is in dollars when known.
const ledger = [
  { when: 'Sept 2025', item: 'Banners at Agriculture and Labor', payer: 'Agriculture Department, Labor Department', amount: 22400, note: 'Agriculture $16,400 for two banners of Trump and Lincoln; Labor about $6,000, including Trump\'s portrait over "American Workers First." A third contract, $33,726 at HHS, paid for "Make America Healthy Again" signs rather than the president\'s face.', kind: 'image', sources: srcs(AXIOS_BAN, SCHIFF_BAN, CNN_BAN25) },
  { when: 'Feb 2026', item: 'Banners at Justice Department headquarters', payer: 'Justice Department', amount: 946960.07, note: 'A $892,192.07 base contract plus $54,768 added later, in records Politico obtained', kind: 'image', sources: srcs(EE_BAN, BEAST_BAN) },
  { when: 'June 2026', item: 'Banner at the Interior Department', payer: 'Interior Department', amount: 39000, note: 'Contract found by Schiff', kind: 'image', sources: srcs(INDY_BAN) },
  { when: 'July 2026', item: 'Banners for the FAA', payer: 'Federal Aviation Administration', amount: 114020, note: 'Contract found by Schiff; runs through 2027', kind: 'image', sources: srcs(INDY_BAN) },
  { when: 'May 2026', item: 'The White House app, pushed onto federal work phones', payer: 'Every executive-branch agency\'s phones', amount: null, note: 'Cost not disclosed', kind: 'channel', sources: srcs(GOVEXEC_APP) },
  { when: 'Sept 2026', item: 'Trump TV, a 24-hour stream', payer: 'The White House', amount: null, note: 'Cost not disclosed', kind: 'channel', sources: srcs(NOTUS_TV) },
  { when: 'Sept 2026', item: 'The television ad', payer: '"the U.S. government," agency unnamed', amount: 14000, note: 'The buy as estimated by AdImpact', kind: 'channel', sources: srcs(AP_AD, WAPO_AD) },
  { when: 'May 2026', item: 'Ballroom security, attempted', payer: 'Proposed in the DHS funding bill', amount: null, note: '$1 billion, struck by the Senate parliamentarian', kind: 'attempt', sources: srcs(HUFF_ICE, BBC_BYRD) },
  { when: 'June 2026', item: 'Ballroom security, released', payer: 'Secret Service, released by the budget office', amount: 351600000, note: 'Released June 16 for "White House Security Measures"', kind: 'ballroom', sources: srcs(RC_SS, WAPO_TRACK) },
  { when: 'Mar 2026', item: 'The DHS ad campaign featuring Secretary Noem', payer: 'Homeland Security', amount: 220000000, note: 'Ended with her firing', kind: 'comparison', sources: srcs(NBC_NOEM, PP_NOEM) },
];

const dive = {
  slug: 'paid-for',
  updated: '2026-09-24',
  trackerIds: IDS,
  meta: {
    kicker: 'Public money',
    title: 'Paid For',
    dek: 'A Trump ad aired on Fox News with a line at the bottom: "paid for by the U.S. government." The banners, the stream, the app and the ballroom, and what the public is paying for.',
    status: 'Nobody has said which agency paid for the ad',
    statusText: 'As of September 24, no agency, contract or appropriation had been identified for the ad. The White House defended it as one of its "public service announcements" but did not say what agency paid. No complaint, inspector general review or request for a GAO opinion was on the record. The ballroom, which the administration says is about 65 percent complete, is expected by summer 2028. The FAA banner contract runs through 2027.',
  },
  hero: {
    deck: [
      'On the night of September 23, 2026, a thirty-second spot ran on Fox News and Newsmax. Images of the president, the "largest tax cuts in history," a promise that "America will never be a communist country," and a line of small text at the bottom: "paid for by the U.S. government." Two days earlier the White House had launched a round-the-clock stream of its own highlights, called Trump TV. Its app is pushed onto federal employees\' work phones. Banners of the president\'s face hang on federal buildings under contracts worth more than a million dollars. And the ballroom he said private donors would pay for has drawn $351.6 million in Secret Service money released for "White House Security Measures."',
      'Below: what each of these costs and who pays, the record in order, the explanations set against the documents, who objected and who defended it, the rules that apply, and what to watch. Every fact is sourced. Every opinion is labeled.',
    ],
    quote: {
      lead: 'Asked by New York Magazine whether he is building monuments to himself, Trump said, "That\'s true," and:',
      text: 'Nobody will do it once I\'m gone. When I leave here, nobody will.',
      cite: 'President Trump, September 2026',
      sources: srcs(CNN_MON, TNR_MON),
    },
  },
  ledger,

  days: [
    { date: '2025-09-17', events: [
      { actor: 'congress', title: 'Schiff reports banners of Trump on three federal buildings',
        body: [
          'Sen. Adam Schiff\'s office reported that the Agriculture Department spent $16,400 on two banners of Trump and Abraham Lincoln, and the Labor Department about $6,000 on banners including Trump\'s portrait over the words "American Workers First." A third contract, $33,726 at Health and Human Services, paid for "Make America Healthy Again" signs. Schiff called the spending illegal, citing prohibitions in federal spending laws since 1951 on taxpayer spending "for publicity or propaganda purposes."',
        ],
        sources: srcs(AXIOS_BAN, SCHIFF_BAN, CNN_BAN25, WEX_BAN) },
    ] },
    { date: '2025-10-20', events: [
      { actor: 'wh', title: 'The East Wing comes down, and the first architect steps aside',
        body: [
          'Demolition of the East Wing began in the week of October 20. The ballroom\'s first architect, James McCrery II, withdrew that week. That month the White House released a list of 37 donors, without the amounts.',
        ],
        sources: srcs(WAPO_ARCH, CNN_DONORS, NBC_DONORS) },
    ] },
    { date: '2026-02-19', events: [
      { actor: 'wh', title: 'A banner of the president goes up on the Justice Department',
        body: [
          'Work crews hung a banner with Trump\'s portrait and the words "Make America Safe Again" on the headquarters of the Justice Department. Former Republican Rep. Barbara Comstock: "Nothing says Justice is Blind like hanging a Dear Leader Banner at DOJ."',
        ],
        sources: srcs(CNN_DOJBAN, AP_DOJBAN, MEDIAITE_DOJBAN) },
    ] },
    { date: '2026-03-05', events: [
      { actor: 'wh', title: 'Noem is fired after a $220 million ad campaign that starred her',
        body: [
          'Trump fired Homeland Security Secretary Kristi Noem after a scandal over a $220 million taxpayer-funded advertising campaign that featured her on horseback. The biggest no-bid contract went to a firm incorporated days before it was awarded. Noem had testified that Trump approved the campaign. A White House spokesperson told NBC News: "POTUS did not sign off on a $220 MILLION dollar ad campaign. Absolutely not."',
        ],
        sources: srcs(NBC_NOEM, PP_NOEM, HILL_NOEM) },
    ] },
    { date: '2026-03-27', events: [
      { actor: 'wh', title: 'The White House launches an app',
        body: [
          'After cryptic teaser videos on its official accounts, the White House released an app with live-streamed briefings, press releases presented as news and an ICE tip line. CNBC reported that it "curates favorable news articles" and left out unfavorable data, such as rising oil prices.',
        ],
        sources: srcs(CNBC_APP, HILL_APP) },
    ] },
    { date: '2026-03-31', events: [
      { actor: 'court', title: 'A judge halts the ballroom: "He is not, however, the owner!"',
        body: [
          'Judge Richard J. Leon, a George W. Bush appointee, halted construction: "The President of the United States is the steward of the White House for future generations of First Families. He is not, however, the owner!" He found the National Trust for Historic Preservation likely to win because "no statute comes close to giving the President the authority he claims to have," and ordered: "Unless and until Congress blesses this project through statutory authorization, construction has to stop!"',
        ],
        sources: srcs(AJ_LEON, SPECTRUM_LEON) },
    ] },
    { date: '2026-04-11', events: [
      { actor: 'court', title: 'An appeals court lets construction continue',
        body: [
          'A federal appeals court in Washington allowed construction of the ballroom to continue while the case goes on.',
        ],
        sources: srcs(NPR_APPEAL, CNN_APPEAL) },
    ] },
    { date: '2026-04-28', events: [
      { actor: 'congress', title: 'Republican senators propose paying for it with customs and park fees',
        body: [
          'Sens. Lindsey Graham, Eric Schmitt and Katie Britt pushed a bill to pay for the ballroom with customs and national park user fees, and Graham said the White House supports it. In the House, Rep. Lauren Boebert said "hardly any" taxpayer money would be involved.',
        ],
        sources: srcs(INDY_GOP) },
    ] },
    { date: '2026-05-05', events: [
      { actor: 'congress', title: 'A billion dollars for ballroom security goes into an immigration bill',
        body: [
          'A $72 billion Republican package for immigration enforcement included $1 billion for the ballroom, which, HuffPost reported, the package specifies is "for the Secret Service to use for security-related aspects."',
        ],
        sources: srcs(HUFF_ICE, BBC_BYRD) },
    ] },
    { date: '2026-05-17', events: [
      { actor: 'congress', title: 'The Senate parliamentarian strikes the billion dollars',
        body: [
          'Parliamentarian Elizabeth MacDonough ruled that the provision failed the Byrd rule, which keeps extraneous items out of budget bills. A spokesman for Majority Leader John Thune: "Redraft. Refine. Resubmit. None of this is abnormal during a Byrd process."',
        ],
        sources: srcs(BBC_BYRD, POL_BYRD) },
    ] },
    { date: '2026-05-22', events: [
      { actor: 'wh', title: 'The app goes onto federal employees\' work phones',
        body: [
          'The federal chief information officer asked agencies to push the app onto government-issued phones. The FAA told its staff it "will automatically install \'The White House\' application on all FAA-issued iPhones and iPads, as mandated by the White House." David Nesting, a former deputy chief information officer at the Office of Personnel Management: "It\'s just making sure all federal employees are forced to see the same propaganda they push."',
        ],
        sources: srcs(GOVEXEC_APP, ENGADGET_APP, RAW_APP) },
    ] },
    { date: '2026-06-04', events: [
      { actor: 'press', title: 'Ballroom donors won $50 billion in contracts, a watchdog finds',
        body: [
          'Public Citizen found that 14 of the 27 publicly identified corporate donors to the ballroom had won new or expanded federal contracts worth more than $50 billion in the six months after its fundraising began, about $43.8 billion of it to Lockheed Martin.',
        ],
        sources: srcs(WAPO_PC, MEDIAITE_PC, TNR_PC) },
    ] },
    { date: '2026-06-16', events: [
      { actor: 'wh', title: 'The budget office releases $351.6 million for "White House Security Measures"',
        body: [
          'The Office of Management and Budget released $351.6 million to the Secret Service, drawn from a roughly $1.17 billion Secret Service appropriation in the reconciliation package. The construction contractor had estimated roughly $300 million of the project\'s cost would come from taxpayers.',
        ],
        sources: srcs(RC_SS, WAPO_TRACK) },
    ] },
    { date: '2026-07-16', events: [
      { actor: 'congress', title: 'Schiff finds more banner contracts, and the Justice Department\'s bill nears $1 million',
        body: [
          'Schiff found $39,000 in contracts for a banner at the Interior Department and $114,020 for the FAA, running through 2027. Records Politico obtained showed the Justice Department paid a $892,192.07 base contract for its banners and $54,768 more. Schiff: "an eight-story high Donald Trump head certainly qualifies as propaganda."',
        ],
        sources: srcs(INDY_BAN, EE_BAN, BEAST_BAN) },
    ] },
    { date: '2026-09-04', events: [
      { actor: 'wh', title: 'Trump on monuments to himself: "That\'s true"',
        body: [
          'Asked by New York Magazine whether he is building monuments to himself, Trump said, "That\'s true," and "Nobody will do it once I\'m gone." Of the ballroom, he said "the people should be thankful."',
        ],
        sources: srcs(CNN_MON, TNR_MON) },
    ] },
    { date: '2026-09-21', events: [
      { time: '7 p.m.', actor: 'wh', title: 'The White House launches Trump TV',
        body: [
          'Three days after banning three news organizations, the White House launched "Trump TV: The Essentials Station," a 24-hour stream of its own past video. Its head of digital strategy, Kaelan Dorr, called it "a livestream of the Administration\'s greatest hits, unfiltered." It opened, NOTUS reported, "with a two-month-old clip of the president speaking at Mount Rushmore."',
        ],
        sources: srcs(NOTUS_TV, NEWSWEEK_TV, BREITBART_TV) },
    ] },
    { date: '2026-09-23', events: [
      { time: 'Overnight', actor: 'wh', title: 'An ad airs: "paid for by the U.S. government"',
        body: [
          'A thirty-second spot of the president\'s record and message ran during conservative shows on Fox News and Newsmax, closing with the line "paid for by the U.S. government." AdImpact put the buy at $14,000. The White House had posted a 15-second version on its official YouTube channel on September 13. It called the ad "educational and unapologetically patriotic" and did not say what agency paid for it.',
          'Two Republican senators objected. Thom Tillis: "using taxpayer dollars, it feels like Viktor Orban." John Kennedy: "I don\'t generally like to see politicians use public money to pay for their own campaign ads."',
        ],
        sources: srcs(AP_AD, INDY_AD, MEDIAITE_AD, WH_VIDEO) },
      { actor: 'press', title: 'A report: the ballroom\'s first architect warned about fire exits',
        body: [
          'The Washington Post reported that McCrery had warned the design gave most guests no way out through the main entrance in an emergency, and that Trump answered, "I am the code." That line rests on two unnamed people; the White House denies that his departure had anything to do with codes. The documents the Post reviewed show a White House official\'s note from a September 30, 2025 meeting: "Life safety — big concern."',
        ],
        sources: srcs(WAPO_ARCH, PEOPLE_ARCH, RD_ARCH) },
    ] },
  ],

  claims: [
    { claim: 'The ballroom would be paid for by private donors.', who: 'Trump, on the ballroom, paraphrased', note: 'His promise, in paraphrase',
      found: 'The public is paying part of it.',
      detail: 'On June 16 the budget office released $351.6 million to the Secret Service for "White House Security Measures." The construction contractor had estimated roughly $300 million of the cost would come from taxpayers, through the Secret Service, the White House Military Office and the Executive Residence. Republicans tried three routes to add public money; the Senate parliamentarian struck one.',
      sources: srcs(RC_SS, WAPO_TRACK, BBC_BYRD) },
    { claim: 'The press, in some cases, reported inaccurately or not at all on the Administration\'s many record breaking accomplishments on behalf of all Americans.', who: 'Kaelan Dorr, White House head of digital strategy, on Trump TV',
      found: 'The stream is the administration\'s own past video, launched as the television pool stood down.',
      detail: 'It carries official video, not reporting, and the White House already streamed the president\'s events on the same channels. It launched the day the five television pool networks suspended pooled coverage, three days after the ban on CNN, MS NOW and Politico, and opened with a two-month-old clip.',
      sources: srcs(NOTUS_TV, TIME_TV, BARRETT_TV) },
    { claim: 'paid for by the U.S. government', who: 'The ad\'s own disclaimer',
      found: 'No agency, contract or appropriation has been named.',
      detail: 'The White House did not say what agency paid for the spot, and no appropriation, contract or producer has been identified by anyone. AdImpact, which tracks media spending, estimates the buy at $14,000.',
      sources: srcs(AP_AD) },
    { claim: 'These public service announcements are about reminding Americans to love their country and understand what makes it worth defending, at home, at our borders, and abroad.', who: 'The White House, in a statement on the ad',
      found: 'It carries the president\'s campaign themes, though it names no candidate.',
      detail: 'The Associated Press: the ad "does not say who voters should support in the midterms, but it meshes with campaign messaging from Trump and other Republicans." It pairs the "largest tax cuts in history" with a 2024 Republican convention clip of Dana White praising Trump, over a song repeating "love me."',
      sources: srcs(AP_AD, HUFF_AD) },
    { claim: 'life safety issues have been addressed and resolved continuously as the design has evolved', who: 'A White House spokesman, on the architect\'s departure',
      found: 'The White House\'s own notes flagged safety, and still needed the president\'s sign-off after the architect left.',
      detail: 'A White House official\'s notes from a September 30, 2025 meeting read "Life safety — big concern," and notes from November 6 read "Life safety — needs POTUS buy in." The Post could not tell from the records whether the problems have been fixed. The project runs through the Executive Residence, which is not a federal agency, and the District of Columbia cannot enforce building codes on federal property.',
      sources: srcs(WAPO_ARCH) },
  ],

  voices: {
    objected: [
      { who: 'Sen. Thom Tillis', role: 'Republican of North Carolina, on the ad', quote: 'It\'s inappropriate. It\'s not like they need a GoFundMe page to have the dollars to do that sort of ad and they could do it. But using taxpayer dollars, it feels like Viktor Orban.', sources: srcs(AP_AD) },
      { who: 'Sen. John Kennedy', role: 'Republican of Louisiana, on the ad', quote: 'I don\'t generally like to see politicians use public money to pay for their own campaign ads.', sources: srcs(AP_AD) },
      { who: 'Stephanie Grisham', role: 'Trump\'s press secretary in his first term, on Trump TV', quote: 'You know who else does this? Russia, China, and Iran to name a few.', sources: srcs(TIME_TV) },
      { who: 'Weijia Jiang', role: 'CBS News, former president of the White House Correspondents\' Association', quote: 'America cannot have state TV', sources: srcs(TIME_TV) },
      { who: 'Sen. Adam Schiff', role: 'Democrat of California, on the banners', quote: 'Not only is this a terrible waste of Americans\' hard-earned money, it is clearly against the law', sources: srcs(INDY_BAN) },
      { who: 'Kevin Kampschroer', role: 'Fifty years overseeing federal construction at the General Services Administration, on the ballroom', quote: 'bottom line is, I don\'t know any commercial building owner that would cheat on the fire code, because the risk is too great.', sources: srcs(WAPO_ARCH) },
    ],
    defended: [
      { who: 'Kaelan Dorr', role: 'White House head of digital strategy, on Trump TV', quote: 'a livestream of the Administration\'s greatest hits, unfiltered', sources: srcs(NOTUS_TV) },
      { who: 'President Trump', role: 'On the ballroom, to New York Magazine', quote: 'the people should be thankful', sources: srcs(CNN_MON) },
      { who: 'Sen. Lindsey Graham', role: 'Republican of South Carolina, on public money for ballroom security', quote: 'It\'s very difficult to have a bunch of important people in the same place unless it\'s really, really secure.', sources: srcs(INDY_GOP) },
      { who: 'The White House', role: 'In a statement on the ad', quote: 'educational and unapologetically patriotic', sources: srcs(AP_AD) },
      { who: 'Shalom Baranes', role: 'The ballroom\'s current architect', quote: 'I can unequivocally state that the ballroom complex has been designed to conform to applicable national building code standards.', sources: srcs(WAPO_ARCH) },
      { who: 'A person close to Trump', role: 'To CNN, on why he builds', quote: 'Look at Donald Trump\'s life, look at what he\'s done: Built things that no one will ever tear down.', sources: srcs(CNN_MON) },
    ],
  },

  rules: [
    { label: 'Since 1951', name: 'The propaganda restriction', body: 'Federal spending laws have barred taxpayer spending "for publicity or propaganda purposes" since 1951, according to Schiff\'s report. The statutes do not define propaganda, the report notes, but "prior prohibited uses of funds have been classified as self-aggrandizement, purely partisan materials, or covert propaganda." As of September 24 nobody had asked the Government Accountability Office for an opinion on the ad, at least not on the record.', sources: srcs(SCHIFF_BAN, WEX_BAN) },
    { label: 'Hatch Act', name: 'Limits on federal employees', body: 'The Hatch Act limits partisan political activity by federal employees. It does not apply to the president. Rep. Jamie Raskin\'s point about the ad is that it would be a violation "for any government employees who worked on it or used government resources to make it."', sources: srcs(MEDIAITE_AD, WAPO_AD, HUFF_AD) },
    { label: 'Byrd rule', name: 'The Senate\'s budget rule', body: 'Budget reconciliation bills pass with 51 votes but may not carry extraneous items. The parliamentarian struck the $1 billion for ballroom security because the spending fell outside the jurisdiction of the Senate Judiciary Committee, which brought the bill.', sources: srcs(BBC_BYRD, POL_BYRD) },
    { label: 'Mar 2026', name: 'Judge Leon\'s injunction', body: 'He found the National Trust for Historic Preservation "likely to succeed on the merits," because "no statute comes close to giving the President the authority he claims to have." An appeals court let construction continue on April 11.', sources: srcs(AJ_LEON, SPECTRUM_LEON, NPR_APPEAL, CNN_APPEAL) },
    { label: 'Residence', name: 'Outside the agency rules', body: 'The ballroom is being built through the Executive Residence, a small office that is not a federal agency and so falls outside the rules that bind agencies. The District of Columbia cannot enforce its building codes on federal property. The construction contract does require compliance with codes, as determined by a White House contracting officer.', sources: srcs(WAPO_ARCH) },
    { label: 'Mar 2026', name: 'The administration\'s own precedent', body: 'A $220 million taxpayer-funded ad campaign featuring a cabinet secretary ended with her firing. DHS had invoked a national emergency declaration to skip competitive bidding.', sources: srcs(NBC_NOEM, PP_NOEM) },
  ],

  watch: [
    { date: '2026-11-03', when: 'Nov 3, 2026', title: 'Election Day', text: 'The ad ran six weeks before the midterms. Watch whether more spots carrying the government disclaimer run before the vote, and whether any agency says it paid.' },
    { when: 'Open', title: 'A GAO opinion or an inspector general', text: 'Either would test the propaganda restriction directly. As of September 24 neither had been asked, at least not on the record.' },
    { when: 'Open', title: 'The donor names', text: 'In August Trump promised to name more ballroom donors: "I\'ll give you names." As of mid-September, NBC News reported, none had been added to the list of 37.', sources: srcs(NBC_DONORS) },
    { when: 'Through 2027', title: 'The FAA banners', text: 'The FAA\'s banner contract runs through 2027.', sources: srcs(INDY_BAN) },
    { when: 'Summer 2028', title: 'The ballroom', text: 'The administration says the roughly $400 million project is about 65 percent complete and expected by summer 2028.', sources: srcs(NBC_DONORS) },
  ],

  take: [
    'Each item here has a defense on its own terms. A president may publish video. An agency may decorate its building. The Secret Service has to protect whatever gets built. Put together, they describe what the propaganda restriction exists to prevent: public money spent to keep one politician\'s face and message in front of the public, most visibly in the weeks before an election.',
    'The ad is the smallest line in the ledger and the plainest. It uses the president\'s campaign themes, a convention clip and a song that repeats "love me," and it carries a government disclaimer. Two Republican senators saw the problem at once. That no agency will say it paid is not a detail. Spending its sponsor will not own is spending nobody can be held to account for.',
    'The ballroom shows the same thing at scale. It was promised as a gift and is being finished partly with public money routed through security budgets, by an office outside the rules that bind agencies. Trump has said plainly why he builds: nobody will do it once he is gone. That is a reason for a private fortune to pay. It is not a reason for the public to.',
  ],

  corrections: [
    { date: '2026-09-24', text: 'Before this page was published, the quotations and figures in its seed entries were checked against the saved text of their sources, and four entries were corrected. The ballroom entry quoted Judge Leon as calling the donor funding a "Rube Goldberg machine"; as Reason reported it, he described it as a "Rube Goldberg contraption," and a quotation of his finding on presidential authority had been cut short before "to have."' },
    { date: '2026-09-24', text: 'The entry on the $72 billion bill put "ballroom security-related aspects" in quotation marks as the bill\'s wording; the phrase was HuffPost\'s description of the package. The architect entry said the November 6 notes came "five weeks" after McCrery left; the Post does not say so, and the gap was a little over two weeks.' },
    { date: '2026-09-24', text: 'The 2025 banner entry described the Labor Department\'s banner as 88 feet long. The 88-foot signs were Health and Human Services\' "Make America Healthy Again" banners, which this page does not count as spending on the president\'s image. The ad entry has also been brought up to date with the White House\'s statement defending the ad.' },
  ],
};

fs.writeFileSync(OUT, JSON.stringify(dive, null, 2) + '\n');
const n = [...JSON.stringify(dive).matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
console.log('wrote', OUT, '|', dive.days.reduce((k, d) => k + d.events.length, 0), 'events |', new Set(n).size, 'unique sources');
