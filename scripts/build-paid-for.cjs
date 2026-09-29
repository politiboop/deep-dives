// Builds src/data/paid-for.json from its seed tracker entries (run: node scripts/build-paid-for.cjs).
// Every source is pulled from a seed entry by a unique substring of its text, so no
// URL on the page is typed by hand. S() throws on zero or multiple matches.
//
// The page answers one question: is public money being used to promote the president
// himself? The ballroom is its own dive (the-ballroom); it is about donors and access.
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

const AP_AD = 'Associated Press: US government foots bill';
const INDY_AD = 'The Independent: Trump commercial';
const MEDIAITE_AD = "Mediaite: 'Absolutely Orwellian!'";
const HUFF_AD = "HuffPost: 'Fascist Propaganda";
const WAPO_AD = 'Washington Post: Trump ad airing';
const WH_VIDEO = 'The White House: America Will Never Be';
const CBS_AD = 'CBS News: New Trump-focused';
const ATL_AD = "The Atlantic: Trump's Public Service";
const NOTUS_TV = 'NOTUS: Days After Press Ban';
const NEWSWEEK_TV = 'Newsweek: White House Launches Trump TV';
const BREITBART_TV = 'Breitbart: White House Launches Trump TV';
const TIME_TV = "Time: White House Launches 'Trump TV'";
const BARRETT_TV = 'Barrett Media';
const GOVEXEC_APP = 'Government Executive: The White House is ordering';
const ENGADGET_APP = 'Engadget';
const RAW_APP = 'Raw Story: White House app';
const CNBC_APP = 'CNBC: White House launches app';
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
const NBC_NOEM = 'NBC News: Trump fires Kristi Noem';
const PP_NOEM = 'ProPublica: Kristi Noem-Tied Firm';
const HILL_NOEM = 'The Hill: Noem faces GOP heat';
const AP_RERUN = 'AP: Trump administration begins airing 2024 Trump campaign ad';
const AP_GROWS = 'AP: Taxpayer-funded pro-Trump TV ad campaign grows';
const NBC_FB = 'NBC News: White House releases new taxpayer-funded ad';
const CNN_FB = 'CNN: White House airs another government-funded ad';
const CNBC_FB = 'CNBC: Taxpayer-funded Trump ads draw';
const CBS_KENNEDY = 'CBS News: Sen. Kennedy urges Trump';
const WH_PSA = 'The White House: Presidential Public Service Announcements';
const PC_COMPLAINT = 'Public Citizen: Taxpayer-Funded Trump Ad Violates';
const AXIOS_PSA = 'Axios: White House defends Trump video ad';
const TIME_BIPART = "Time: Trump's Taxpayer-Funded Ads Draw";
const USPTO_TV = 'USPTO: TRUMP TV';
const NEWSWEEK_TM = "Newsweek: Trump Company Files Trademark";
const AP_DHS = 'AP: Homeland Security taps $20M';
const WSJ_CBP = 'Wall Street Journal: Homeland Security Money';
const NBC_CBP = 'NBC News: Pro-Trump TV ads paid for with Customs';
const CNBC_CBP = 'CNBC: Trump government ads were funded';
const CNN_ROLE = 'CNN: Trump personally helped orchestrate';
const WEX_CBP = 'Washington Examiner: Trump administration using border money';
const HILL_GOP = 'The Hill: GOP senators push back';
const POLITICO_GOP = 'Politico: Trump controversies pile on';
const INDY_MASSIE = 'The Independent: Trump trolled';
const SEN_LETTER = 'Letter from Sens. Murray and Murphy';
const USASPENDING = 'USAspending.gov: CBP award';
const PC_FCC = 'Public Citizen: Complaint to the FCC and FTC';

// ── The ledger. amount is in dollars when known; agencies counts the agencies paying.
const ledger = [
  { when: 'Sept 2025', item: 'Banners at Agriculture and Labor', payer: 'Agriculture Department, Labor Department', agencies: 2, amount: 22400, note: 'Agriculture $16,400 for two banners of Trump and Lincoln; Labor about $6,000, including Trump\'s portrait over "American Workers First." A third contract, $33,726 at HHS, paid for "Make America Healthy Again" signs rather than the president\'s face.', kind: 'image', sources: srcs(AXIOS_BAN, SCHIFF_BAN, CNN_BAN25) },
  { when: 'Feb 2026', item: 'Banners at Justice Department headquarters', payer: 'Justice Department', agencies: 1, amount: 946960.07, note: 'A $892,192.07 base contract plus $54,768 added later, in records Politico obtained', kind: 'image', sources: srcs(EE_BAN, BEAST_BAN) },
  { when: 'June 2026', item: 'Banner at the Interior Department', payer: 'Interior Department', agencies: 1, amount: 39000, note: 'Contract found by Schiff', kind: 'image', sources: srcs(INDY_BAN) },
  { when: 'July 2026', item: 'Banners for the FAA', payer: 'Federal Aviation Administration', agencies: 1, amount: 114020, note: 'Contract found by Schiff; runs through 2027', kind: 'image', sources: srcs(INDY_BAN) },
  { when: 'May 2026', item: 'The White House app, pushed onto federal work phones', payer: 'Every executive-branch agency\'s phones', amount: null, note: 'Cost not disclosed', kind: 'channel', sources: srcs(GOVEXEC_APP) },
  { when: 'Sept 2026', item: 'Trump TV, a 24-hour stream', payer: 'The White House', amount: null, note: 'Cost not disclosed. On September 24 the Trump Organization\'s trademark company applied to register TRUMP TV for news broadcasting and streaming', kind: 'channel', sources: srcs(NOTUS_TV, USPTO_TV) },
  { when: 'Sept 2026', item: 'The television ads', payer: 'Customs and Border Protection funds, confirmed by Sen. Susan Collins', amount: 2500000, note: 'More than $2.5 million by AdImpact\'s count for three ads over seven days, the AP reported September 29; AdImpact misses some cable airings, and the first buy was about $14,000. Sens. Murray and Murphy say DHS appears to have dedicated $20 million; a $20 million CBP "National Media Campaign" contract awarded September 20 has not been tied to the ads', kind: 'channel', sources: srcs(AP_DHS, NBC_CBP, CNBC_CBP, SEN_LETTER, USASPENDING) },
  { when: 'Mar 2026', item: 'The DHS ad campaign featuring Secretary Noem', payer: 'Homeland Security', amount: 220000000, note: 'Ended with her firing', kind: 'comparison', sources: srcs(NBC_NOEM, PP_NOEM) },
];

const dive = {
  slug: 'paid-for',
  updated: '2026-09-29',
  trackerIds: IDS,
  section: 'corruption',
  meta: {
    kicker: 'Public money',
    title: 'Paid For',
    dek: 'Is public money being used to promote the president himself? Banners of his face, an app on federal phones, a 24-hour stream and a TV ad with a government disclaimer: what each cost and who paid.',
    status: 'The ads are paid for with border-security money, a Republican senator confirms, and DHS still has not said so',
    statusText: 'On September 29 the source of the money came out: Customs and Border Protection funds from the 2025 reconciliation law, as the Wall Street Journal reported and Sen. Susan Collins, the Republican who chairs Senate Appropriations, confirmed. DHS referred questions to the White House, which has not confirmed it. Democratic senators say DHS appears to have dedicated $20 million; AdImpact counts more than $2.5 million in airtime so far. Public Citizen has complaints before GAO, the Office of Special Counsel, the FCC and the FTC; none has acted. The FAA banner contract runs through 2027.',
  },
  hero: {
    question: 'Is public money being used to promote the president himself?',
    answer: 'The government has put the president\'s face or message in front of the public in at least four ways: banners of his face paid for by five federal agencies, a television ad carrying his message under the line "paid for by the U.S. government," a 24-hour White House stream of its own highlights, and a White House app pushed onto federal employees\' work phones.',
    rule: 'Federal spending laws have barred taxpayer spending "for publicity or propaganda purposes" since 1951. Whether any of this crosses that line has not been tested; no ruling on it is on the record.',
    ruleSources: srcs(SCHIFF_BAN, AP_AD),
    deck: [
      'The newest examples began on the night of September 23, 2026: a thirty-second spot during conservative shows on Fox News and Newsmax. Images of the president, the "largest tax cuts in history," a promise that "America will never be a communist country," and a line of small text at the bottom: "paid for by the U.S. government." The White House calls it a public service announcement. Within five days there were at least four spots, one of them a rerun of a 2024 Trump campaign ad, airing during NFL games.',
      'Below: what each item cost and who paid, the record in order, the explanations set against the documents, who objected and who defended it, the rules that apply, and what to watch. Every fact is sourced. Every opinion is labeled.',
    ],
    quote: {
      lead: 'A Republican senator, on the ad:',
      text: 'It\'s inappropriate. It\'s not like they need a GoFundMe page to have the dollars to do that sort of ad and they could do it. But using taxpayer dollars, it feels like Viktor Orban.',
      cite: 'Sen. Thom Tillis of North Carolina, September 2026',
      sources: srcs(AP_AD),
    },
  },
  ledger,

  days: [
    { date: '2025-09-17', events: [
      { actor: 'congress', title: 'Schiff reports banners of Trump on federal buildings', kind: 'banners',
        body: [
          'Sen. Adam Schiff\'s office reported that the Agriculture Department spent $16,400 on two banners of Trump and Abraham Lincoln, and the Labor Department about $6,000 on banners including Trump\'s portrait over the words "American Workers First." A third contract, $33,726 at Health and Human Services, paid for "Make America Healthy Again" signs. Schiff called the spending illegal, citing prohibitions in federal spending laws since 1951 on taxpayer spending "for publicity or propaganda purposes."',
          'The Labor Department said its banners were made for Labor Day and the country\'s 250th anniversary. The White House called Schiff a "serial liar."',
        ],
        sources: srcs(AXIOS_BAN, SCHIFF_BAN, CNN_BAN25, WEX_BAN) },
    ] },
    { date: '2026-02-19', events: [
      { actor: 'wh', title: 'A banner of the president goes up on the Justice Department', kind: 'banners',
        body: [
          'Work crews hung a banner with Trump\'s portrait and the words "Make America Safe Again" on the headquarters of the Justice Department. A department spokesperson: "We are proud at this Department of Justice to celebrate 250 years of our great country and our historic work to make America safe again at President Trump\'s direction." Former Republican Rep. Barbara Comstock: "Nothing says Justice is Blind like hanging a Dear Leader Banner at DOJ."',
        ],
        sources: srcs(CNN_DOJBAN, AP_DOJBAN, MEDIAITE_DOJBAN) },
    ] },
    { date: '2026-03-05', events: [
      { actor: 'wh', title: 'Noem is fired after a $220 million ad campaign that starred her', kind: 'ads',
        body: [
          'Trump fired Homeland Security Secretary Kristi Noem after a scandal over a $220 million taxpayer-funded advertising campaign that featured her on horseback. The biggest no-bid contract went to a firm incorporated days before it was awarded. Noem had testified that Trump approved the campaign. A White House spokesperson told NBC News: "POTUS did not sign off on a $220 MILLION dollar ad campaign. Absolutely not."',
        ],
        sources: srcs(NBC_NOEM, PP_NOEM, HILL_NOEM) },
    ] },
    { date: '2026-03-27', events: [
      { actor: 'wh', title: 'The White House launches an app', kind: 'channels',
        body: [
          'After cryptic teaser videos on its official accounts, the White House released an app with live-streamed briefings, press releases presented as news and an ICE tip line. CNBC reported that it "curates favorable news articles" and left out unfavorable data, such as rising oil prices.',
        ],
        sources: srcs(CNBC_APP, HILL_APP) },
    ] },
    { date: '2026-05-22', events: [
      { actor: 'wh', title: 'The app goes onto federal employees\' work phones', kind: 'channels',
        body: [
          'The federal chief information officer asked agencies to push the app onto government-issued phones. The FAA told its staff it "will automatically install \'The White House\' application on all FAA-issued iPhones and iPads, as mandated by the White House." David Nesting, a former deputy chief information officer at the Office of Personnel Management: "It\'s just making sure all federal employees are forced to see the same propaganda they push."',
        ],
        sources: srcs(GOVEXEC_APP, ENGADGET_APP, RAW_APP) },
    ] },
    { date: '2026-07-16', events: [
      { actor: 'congress', title: 'Schiff finds more banner contracts, and the Justice Department\'s bill nears $1 million', kind: 'banners',
        body: [
          'Schiff found $39,000 in contracts for a banner at the Interior Department and $114,020 for the FAA, running through 2027. Records Politico obtained showed the Justice Department paid a $892,192.07 base contract for its banners and $54,768 more. Schiff: "an eight-story high Donald Trump head certainly qualifies as propaganda."',
          'The White House did not respond directly to questions about the contracts\' legality. Its spokesman said Schiff was willing "to trash the United States of America during its semiquincentennial celebration simply because he hates President Trump."',
        ],
        sources: srcs(INDY_BAN, EE_BAN, BEAST_BAN) },
    ] },
    { date: '2026-09-21', events: [
      { time: '7 p.m.', actor: 'wh', title: 'The White House launches Trump TV', kind: 'channels',
        body: [
          'Three days after banning three news organizations, the White House launched "Trump TV: The Essentials Station," a 24-hour stream of its own past video. Its head of digital strategy, Kaelan Dorr, called it "a livestream of the Administration\'s greatest hits, unfiltered." It opened, NOTUS reported, "with a two-month-old clip of the president speaking at Mount Rushmore."',
        ],
        sources: srcs(NOTUS_TV, NEWSWEEK_TV, BREITBART_TV) },
    ] },
    { date: '2026-09-23', events: [
      { time: 'Overnight', actor: 'wh', title: 'An ad airs: "paid for by the U.S. government"', kind: 'ads',
        body: [
          'A thirty-second spot of the president\'s record and message ran during conservative shows on Fox News and Newsmax, closing with the line "paid for by the U.S. government." AdImpact put the buy at $14,000. The White House had posted a 15-second version on its official YouTube channel on September 13. It called the ad "educational and unapologetically patriotic" and did not say what agency paid for it.',
          'Two Republican senators objected. Thom Tillis: "using taxpayer dollars, it feels like Viktor Orban." John Kennedy: "I don\'t generally like to see politicians use public money to pay for their own campaign ads."',
        ],
        sources: srcs(AP_AD, INDY_AD, MEDIAITE_AD, WH_VIDEO) },
    ] },
    { date: '2026-09-24', events: [
      { actor: 'wh', title: 'A second ad, on the national networks', kind: 'ads',
        body: [
          'CBS News reported that the ad began running on national networks, CBS among them, and that a second government-paid ad, recounting the U.S. capture of former Venezuelan President Nicolás Maduro and featuring Trump and his top Cabinet officials, aired on CBS stations and other networks that evening. There are 30- and 60-second versions. The government produced the content and paid for the air time through an ad agency, CBS reported.',
          'The musician JMSN said he never licensed the song: "I would never authorize my music to be used for ANY political agenda or campaign." A White House official told CBS the ads "are clearly not political."',
        ],
        sources: srcs(CBS_AD, ATL_AD) },
      { actor: 'congress', title: 'Democrats demand the cost, then that the ads come down', kind: 'ads',
        body: [
          'Sen. Maggie Hassan asked chief of staff Susie Wiles for the cost, the contractors, the source of the funding and whether money was diverted from federal agencies. The top Democratic appropriators, Sens. Patty Murray and Jack Reed and Reps. Rosa DeLauro and Steny Hoyer, demanded that it be pulled: "This is the sort of government propaganda one might expect in North Korea, not the United States of America, and it is an egregious and illegal misuse of Americans\' hard-earned tax dollars."',
        ],
        sources: srcs(CBS_AD) },
    ] },
    { date: '2026-09-25', events: [
      { actor: 'wh', title: 'A third spot, and a defense: "Nothing New"', kind: 'ads',
        body: [
          'A minute-long ad began airing on Newsmax with video of Mount Rushmore at night and clips of Trump\'s Fourth of July speech there: "This is only the beginning of the golden age of America." The White House published "Presidential Public Service Announcements Are Nothing New," calling the criticism "highly dishonest" and citing a Bush-era Medicare campaign, Obama\'s EPA and Biden\'s vaccination drive. NBC News noted that the Government Accountability Office had faulted the Bush campaign for not disclosing the government as its source and the Obama one for violating "publicity or propaganda and anti-lobbying provisions."',
        ],
        sources: srcs(AP_GROWS, WH_PSA, NBC_FB) },
      { actor: 'press', title: 'A watchdog asks GAO and the Office of Special Counsel to rule', kind: 'ads',
        body: [
          'Public Citizen filed a complaint alleging the ads violate the laws against using government resources for propaganda and, for the staff involved, the Hatch Act. Co-president Lisa Gilbert: "Taxpayer funds cannot pay for partisan political propaganda."',
        ],
        sources: srcs(PC_COMPLAINT) },
    ] },
    { date: '2026-09-27', events: [
      { actor: 'wh', title: 'A 2024 campaign ad airs during NFL games, now "Paid for by the U.S. Government"', kind: 'ads',
        body: [
          'A thirty-second black-and-white spot of Trump walking down a hallway, which the Associated Press called "virtually identical to one that aired in 2024," ran during Fox\'s broadcasts of two NFL games, CNN reported. Trump in it: "We will throw off the sick political class that hates our country. We will rout the fake news media, and we will liberate America from these villains once and for all." NBC News reported that the government version drops the campaign ending and adds "Paid for by the U.S. government." AdImpact put spending on the ads at more than $1.7 million.',
        ],
        sources: srcs(AP_RERUN, CNN_FB, NBC_FB) },
      { actor: 'congress', title: 'Republicans object, on camera', kind: 'ads',
        body: [
          'Sen. John Kennedy of Louisiana, on CBS\'s "Face the Nation": "I don\'t think any public official, including President Trump or Kristi Noem or John Kennedy, should spend public money on private ads for themselves." Rep. Thomas Massie of Kentucky: "Don\'t worry, using taxpayer dollars to run ominous campaign ads of the President has been done before and is completely legal… in banana republics."',
        ],
        sources: srcs(CBS_KENNEDY, TIME_BIPART, CNN_FB) },
    ] },
    { date: '2026-09-29', events: [
      { actor: 'congress', title: 'The money turns out to be border funds, and a Republican chairman confirms it', kind: 'ads',
        body: [
          'The Wall Street Journal reported, and NBC News, the Associated Press and CNBC confirmed, that the ads are paid for with Customs and Border Protection money from the 2025 reconciliation law rather than annual appropriations. Sen. Susan Collins of Maine, who chairs the Senate Appropriations Committee, confirmed it on the record, saying "it was taken out of funding that was supposed to be for Customs and Border Protection." DHS referred questions to the White House. Sens. Patty Murray and Chris Murphy wrote that "it appears DHS has dedicated $20 million to this outrageous scheme" and asked for answers within 48 hours. CNBC found a $20 million CBP contract for a "National Media Campaign" awarded September 20, one day after the budget office released $20 million to CBP under a "Commemorative Events" line; the public record does not yet tie that contract to these ads.',
        ],
        sources: srcs(WSJ_CBP, NBC_CBP, AP_DHS, CNBC_CBP, SEN_LETTER, USASPENDING) },
      { actor: 'press', title: 'CNN: the president drove the ads himself', kind: 'ads',
        body: [
          'CNN, citing one source familiar with the matter, reported that Trump personally drove the ads, including helping select the imagery and videos, and two Trump advisers told CNN they are made in-house by the White House video team. The Journal, citing people familiar, reported he pushed for them. Both accounts rest on anonymous sources.',
        ],
        sources: srcs(CNN_ROLE, CNBC_CBP) },
      { actor: 'congress', title: 'The Senate majority leader objects', kind: 'ads',
        body: [
          'Majority Leader John Thune: "It\'s a great message. I like the message, but it shouldn\'t be paid for with taxpayer dollars." Sen. Thom Tillis: "I hate it. I tell you, it feels like Viktor Orbán talking to the Hungarian people." White House spokesperson Davis Ingle answered the criticism by calling Trump "the unequivocal leader, best messenger, and unmatched motivator for the Republican Party."',
        ],
        sources: srcs(HILL_GOP, POLITICO_GOP, INDY_MASSIE, NBC_CBP) },
      { actor: 'press', title: 'A second complaint asks regulators to have broadcasters pull the ads', kind: 'ads',
        body: [
          'Public Citizen asked the Federal Communications Commission and the Federal Trade Commission to "direct broadcasters to stop broadcasting" the ads, arguing that because Trump is not a candidate, stations are free to refuse them.',
        ],
        sources: srcs(PC_FCC) },
    ] },
  ],

  claims: [
    { claim: 'We are proud at this Department of Justice to celebrate 250 years of our great country and our historic work to make America safe again at President Trump\'s direction.', who: 'A Justice Department spokesperson, on its banner',
      found: 'The banners carry the sitting president\'s portrait and his slogans.',
      detail: 'The Justice Department\'s banners show Trump\'s official portrait above "MAKE AMERICA SAFE AGAIN," under $946,960 in contracts. Labor\'s put him over "American Workers First." The FAA\'s banner contract runs through 2027.',
      sources: srcs(CNN_DOJBAN, EE_BAN, CNN_BAN25, INDY_BAN) },
    { claim: 'we\'re reinforcing the material at no charge to taxpayers, so our big, beautiful banners can securely stay up in celebration of America\'s 250th birthday', who: 'Courtney Parella, Labor Department spokesperson',
      found: 'The banners themselves were bought with public money.',
      detail: 'The department confirmed it spent roughly $6,000 on its banners. Contracts for banners of the president found so far, across five agencies, total $1.12 million.',
      sources: srcs(CNN_BAN25, INDY_BAN, EE_BAN) },
    { claim: 'The press, in some cases, reported inaccurately or not at all on the Administration\'s many record breaking accomplishments on behalf of all Americans.', who: 'Kaelan Dorr, White House head of digital strategy, on Trump TV',
      found: 'The stream is the administration\'s own past video, launched as the television pool stood down.',
      detail: 'It carries official video, not reporting, and the White House already streamed the president\'s events on the same channels. It launched the day the five television pool networks suspended pooled coverage, three days after the ban on CNN, MS NOW and Politico, and opened with a two-month-old clip.',
      sources: srcs(NOTUS_TV, TIME_TV, BARRETT_TV) },
    { claim: 'paid for by the U.S. government', who: 'The ad\'s own disclaimer',
      found: 'The money is Customs and Border Protection funding, a Republican senator confirmed; the administration still has not said so.',
      detail: 'The Wall Street Journal reported, and Sen. Susan Collins confirmed, that the money came from Customs and Border Protection funds in the 2025 reconciliation law. DHS referred questions to the White House. CBS News reported that the government produced the ads and bought the air time through an ad agency, which it did not name. AdImpact estimated the first buy at $14,000 and more than $2.5 million over the first week of three ads.',
      sources: srcs(AP_AD, CBS_AD, NBC_CBP, AP_DHS) },
    { claim: 'Patriotism isn\'t partisan.', who: 'The White House, "Presidential Public Service Announcements Are Nothing New"',
      found: 'The precedents it cites were campaigns about policies, and GAO faulted two of them.',
      detail: 'The Associated Press noted that the earlier campaigns promoted particular policies, not the president in office. NBC News noted GAO faulted the Bush Medicare campaign for not disclosing the government as its source and Obama\'s EPA campaign for violating "publicity or propaganda and anti-lobbying provisions." In the White House\'s favor, Axios noted that "GAO has said concealment of the government\'s role is central to a finding of covert propaganda," and these spots label themselves.',
      sources: srcs(WH_PSA, AP_RERUN, NBC_FB, AXIOS_PSA) },
    { claim: 'The President is not on the ballot and the ads don\'t have a call to action.', who: 'A White House official, to CBS News',
      found: 'Experts told CBS the ads likely do not break election law. The propaganda restriction is a separate question.',
      detail: 'Columbia law professor Richard Briffault: "It doesn\'t appear to be supporting or endorsing a candidate for public office." He agreed with Sen. Maggie Hassan, though, that there are questions under the propaganda law. Hassan wrote that the ad "appears to run afoul of federal prohibitions against the use of appropriated funds as part of \'a general propaganda effort designed to aid a political party or candidates\'".',
      sources: srcs(CBS_AD) },
    { claim: 'These public service announcements are about reminding Americans to love their country and understand what makes it worth defending, at home, at our borders, and abroad.', who: 'The White House, in a statement on the ad',
      found: 'It carries the president\'s campaign themes, though it names no candidate.',
      detail: 'The Associated Press: the ad "does not say who voters should support in the midterms, but it meshes with campaign messaging from Trump and other Republicans." It pairs the "largest tax cuts in history" with a 2024 Republican convention clip of Dana White praising Trump, over a song repeating "love me."',
      sources: srcs(AP_AD, HUFF_AD) },
  ],

  voices: {
    objected: [
      { who: 'Sen. John Thune', role: 'Senate Majority Leader, Republican of South Dakota', quote: 'It\'s a great message. I like the message, but it shouldn\'t be paid for with taxpayer dollars.', sources: srcs(HILL_GOP, NBC_CBP) },
      { who: 'Sen. John Kennedy', role: 'Republican of Louisiana, on "Face the Nation"', quote: 'I don\'t think any public official, including President Trump or Kristi Noem or John Kennedy, should spend public money on private ads for themselves.', sources: srcs(CBS_KENNEDY) },
      { who: 'Rep. Thomas Massie', role: 'Republican of Kentucky, on the campaign-ad rerun', quote: 'Don\'t worry, using taxpayer dollars to run ominous campaign ads of the President has been done before and is completely legal… in banana republics.', sources: srcs(CNN_FB) },
      { who: 'Sen. Adam Schiff', role: 'Democrat of California, on the banners', quote: 'Not only is this a terrible waste of Americans\' hard-earned money, it is clearly against the law', sources: srcs(INDY_BAN) },
      { who: 'Barbara Comstock', role: 'Former Republican congresswoman, on the Justice Department banner', quote: 'Nothing says Justice is Blind like hanging a Dear Leader Banner at DOJ.', sources: srcs(MEDIAITE_DOJBAN) },
      { who: 'Stephanie Grisham', role: 'Trump\'s press secretary in his first term, on Trump TV', quote: 'You know who else does this? Russia, China, and Iran to name a few.', sources: srcs(TIME_TV) },
      { who: 'Sens. Patty Murray and Jack Reed, Reps. Rosa DeLauro and Steny Hoyer', role: 'The top Democratic appropriators, on the ads', quote: 'This is the sort of government propaganda one might expect in North Korea, not the United States of America', sources: srcs(CBS_AD) },
      { who: 'Weijia Jiang', role: 'CBS News, former president of the White House Correspondents\' Association', quote: 'America cannot have state TV', sources: srcs(TIME_TV) },
    ],
    defended: [
      { who: 'Davis Ingle', role: 'White House spokesperson, on the criticism of the ads', quote: 'the unequivocal leader, best messenger, and unmatched motivator for the Republican Party', sources: srcs(INDY_MASSIE) },
      { who: 'The White House', role: 'In a statement on the ad', quote: 'educational and unapologetically patriotic', sources: srcs(AP_AD) },
      { who: 'A White House official', role: 'To CBS News, on the ads', quote: 'The President is not on the ballot and the ads don\'t have a call to action.', sources: srcs(CBS_AD) },
      { who: 'Steven Cheung', role: 'White House communications director', quote: 'Don\'t let the Fake News get away with their lies about our epic Public Service Announcements that have been running on tv.', sources: srcs(NBC_FB) },
      { who: 'A Justice Department spokesperson', role: 'On the banner at its headquarters', quote: 'We are proud at this Department of Justice to celebrate 250 years of our great country', sources: srcs(CNN_DOJBAN) },
      { who: 'Courtney Parella', role: 'Labor Department spokesperson, on its banners', quote: 'The banners were originally displayed for Labor Day. After tremendous positive response, we\'re reinforcing the material at no charge to taxpayers', sources: srcs(CNN_BAN25) },
      { who: 'Kaelan Dorr', role: 'White House head of digital strategy, on Trump TV', quote: 'a livestream of the Administration\'s greatest hits, unfiltered', sources: srcs(NOTUS_TV) },
      { who: 'Davis Ingle', role: 'White House spokesman, on Schiff\'s banner findings', quote: 'It\'s a complete disgrace that Pencil-Neck Adam Schiff is willing to trash the United States of America during its semiquincentennial celebration simply because he hates President Trump.', sources: srcs(INDY_BAN) },
    ],
  },

  rules: [
    { label: 'Since 1951', name: 'The propaganda restriction', body: 'Federal spending laws have barred taxpayer spending "for publicity or propaganda purposes" since 1951, according to Schiff\'s report. The statutes do not define propaganda, the report notes, but "prior prohibited uses of funds have been classified as self-aggrandizement, purely partisan materials, or covert propaganda." On September 25 Public Citizen asked the Government Accountability Office to find that the ads violate it; GAO has not responded publicly.', sources: srcs(SCHIFF_BAN, WEX_BAN, PC_COMPLAINT) },
    { label: 'Hatch Act', name: 'Limits on federal employees', body: 'The Hatch Act limits partisan political activity by federal employees. It does not apply to the president. Rep. Jamie Raskin\'s point about the ad is that it would be a violation "for any government employees who worked on it or used government resources to make it."', sources: srcs(MEDIAITE_AD, WAPO_AD, HUFF_AD) },
    { label: 'Mar 2026', name: 'The administration\'s own precedent', body: 'A $220 million taxpayer-funded ad campaign featuring a cabinet secretary ended with her firing. DHS had invoked a national emergency declaration to skip competitive bidding.', sources: srcs(NBC_NOEM, PP_NOEM) },
  ],

  watch: [
    { date: '2026-11-03', when: 'Nov 3, 2026', title: 'Election Day', text: 'The ad ran six weeks before the midterms. Watch whether more spots carrying the government disclaimer run before the vote, and whether DHS answers the senators\' questions about the border money.' },
    { when: 'Open', title: 'The senators\' 48 hours', text: 'Sens. Murray and Murphy asked DHS on September 29 for a breakdown of the funds, copies of the contracts and who directed them, within 48 hours, copying the department\'s inspector general. Hassan\'s earlier questions on cost and contractors are also unanswered.', sources: srcs(SEN_LETTER, CBS_AD) },
    { when: 'Open', title: 'Public Citizen\'s complaints', text: 'Filed September 25 with the Government Accountability Office and the Office of Special Counsel, and September 29 with the FCC and FTC. A GAO opinion would test the propaganda restriction directly. None has acted.', sources: srcs(PC_COMPLAINT) },
    { when: 'Through 2027', title: 'The FAA banners', text: 'The FAA\'s banner contract runs through 2027.', sources: srcs(INDY_BAN) },
  ],

  take: [
    'Each item here has a defense on its own terms. A president may publish video, and agencies may mark an anniversary. Put together, they describe what the propaganda restriction exists to prevent: public money spent to keep one politician\'s face and message in front of the public, most visibly in the weeks before an election.',
    'The ads began as the smallest line in the ledger and are now the largest, and they were always the plainest. One uses the president\'s campaign themes, a convention clip and a song that repeats "love me"; another is his 2024 campaign ad with the campaign ending cut off. Both carry a government disclaimer. Republicans in both chambers saw the problem at once. The money turned out to be border-security funds, and the administration still will not say so; a Republican senator had to. Spending its sponsor will not own is spending nobody can be held to account for.',
    'The anniversary defense deserves a fair hearing, and the banners answer it themselves. They carry the sitting president\'s portrait and his own slogans, one of them on the headquarters of the department meant to be independent of him, and one contract runs into 2027.',
  ],

  corrections: [
    { date: '2026-09-24', text: 'Before this page was published, its sources were checked against the saved text of each article. The 2025 banner entry it draws on described the Labor Department\'s banner as 88 feet long. The 88-foot signs were Health and Human Services\' "Make America Healthy Again" banners, which this page does not count as spending on the president\'s image. The ad entry has also been brought up to date with the White House\'s statement defending the ad.' },
    { date: '2026-09-28', text: 'Earlier versions of this page said that, as of September 25, no complaint or request for a GAO opinion was on the record. Public Citizen had filed one with GAO and the Office of Special Counsel that day. The ledger\'s figure for the ads, $14,000, was AdImpact\'s estimate of the first buy; it has been replaced with AdImpact\'s running estimate, more than $1.7 million.' },
    { date: '2026-09-25', text: 'This page was narrowed to one question, whether public money is promoting the president himself. The White House ballroom, which it first included, now has its own page, since its story is about donors and access. The administration\'s answers on the banners were added.' },
  ],
};

fs.writeFileSync(OUT, JSON.stringify(dive, null, 2) + '\n');
const n = [...JSON.stringify(dive).matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
console.log('wrote', OUT, '|', dive.days.reduce((k, d) => k + d.events.length, 0), 'events |', new Set(n).size, 'unique sources');
