// Builds src/data/the-ballroom.json from its seed tracker entries (run: node scripts/build-the-ballroom.cjs).
// Every source is pulled from a seed entry by a unique substring of its text, so no
// URL on the page is typed by hand. S() throws on zero or multiple matches.
//
// The page answers one question: who is paying for the president's ballroom, and what
// have they gotten since? It is the "access" dive in the corruption section.
const fs = require('fs');
const path = require('path');
const TRACKER = path.join(__dirname, '..', '..', 'controversial-trump', 'data', 'controversies') + '/';
const OUT = path.join(__dirname, '..', 'src', 'data', 'the-ballroom.json');
const IDS = [
  'white-house-ballroom-donor-funded',
  'supreme-court-lets-ballroom-construction-continue-5-4-roberts-dissent',
  'ballroom-donors-50-billion-federal-contracts-public-citizen',
  'gop-taxpayer-funding-trump-ballroom-graham-schmitt-britt',
  'republican-72-billion-ice-bill-1-billion-trump-ballroom',
  'senate-parliamentarian-strikes-1-billion-ballroom-security-funding-byrd-rule',
  'doj-uses-whcd-shooting-pretext-kill-ballroom-lawsuit',
  'doj-trump-could-bulldoze-statue-of-liberty-ballroom-appeal',
  'ballroom-architect-mccrery-quit-fire-exits-i-am-the-code',
  'trump-monuments-nobody-will-do-it-once-im-gone',
];
const pool = new Map();
for (const id of IDS) for (const s of JSON.parse(fs.readFileSync(TRACKER + id + '.json', 'utf8')).sources) if (!pool.has(s.url)) pool.set(s.url, s);
function S(needle) {
  const hits = [...pool.values()].filter((s) => s.text.includes(needle));
  if (hits.length !== 1) throw new Error(`S(${JSON.stringify(needle)}) matched ${hits.length} sources`);
  return { text: hits[0].text, url: hits[0].url };
}
const srcs = (...needles) => needles.map(S);

const WH_REL = 'White House: White House Ballroom Construction to Begin';
const ABC_DONORS = 'ABC News: What we know about the donors';
const FORTUNE = 'Fortune: Meet all 37';
const TIME_B = 'TIME: Who Is Paying';
const NBC_LIST = 'NBC News: See the donor list';
const CNN_LIST = 'CNN: White House releases list of donors';
const NBC_NAMES = 'NBC News: Trump vowed to identify';
const AJ_LEON = 'Al Jazeera (Reuters): Judge temporarily halts';
const SPECTRUM = 'Spectrum News (Associated Press)';
const ABC_LEON = "ABC News: 'Construction has to stop!'";
const NPR_APPEAL = 'NPR: D.C. appeals court';
const CNN_APPEAL = 'CNN: Appeals court allows';
const REASON = 'Reason: Even if Trump';
const ORDER = 'Supreme Court of the United States: National Park Service v. National Trust';
const SB31 = 'SCOTUSblog: Supreme Court allows construction';
const SB21 = 'SCOTUSblog: Supreme Court allows White House ballroom construction to continue for now';
const CNN31 = 'CNN: Supreme Court allows Trump to continue';
const NBC31 = 'NBC News: Supreme Court allows Trump to move forward';
const CNBC31 = 'CNBC: Supreme Court lets Trump build';
const CNBC21 = 'CNBC: Supreme Court allows Trump to continue White House ballroom construction for now';
const LI = 'Legal Insurrection';
const REUTERS7 = 'Reuters (via Yahoo): US appeals court blocks';
const WAPO_PC = 'Washington Post: Ballroom donors won';
const MEDIAITE_PC = 'Mediaite: Corporate Donors';
const TNR_PC = "The New Republic: Trump's Ballroom Donors";
const INDY_GOP = 'The Independent: Republicans now plan';
const WAPO_TRACK = 'Washington Post: Tracking';
const RC_SS = 'Roll Call: Secret Service disbursements';
const HUFF_ICE = 'HuffPost: Republicans push $72 billion';
const BBC_BYRD = 'BBC News: Trump';
const POL_BYRD = 'Politico: Ballroom won';
const CNBC_WHCD = 'CNBC: Trump ballroom lawsuit plaintiff';
const AP_WHCD = 'AP News: National Trust says';
const TNR_BULL = 'The New Republic: DOJ Declares';
const ABC_BULL = "ABC News: DOJ argues Trump could 'bulldoze'";
const LC_BULL = 'Law&Crime';
const WAPO_ARCH = "Washington Post: 'I am the code'";
const PEOPLE_ARCH = 'People: Architect';
const RD_ARCH = 'The Real Deal';
const CNN_MON = "CNN: Trump says 'nobody will'";
const TNR_MON = 'The New Republic: Trump reveals why';

const ledger = [
  { group: 'The project', when: 'Oct 2025', item: 'The cost, as the administration gives it', payer: 'Estimates rose from $200 million to $300 million to $400 million', amount: 400000000, kind: 'project', sources: srcs(TIME_B, FORTUNE, NBC_NAMES) },
  { group: 'The project', when: 'June 2026', item: 'The cost, as the contractor estimated it', payer: 'Clark Construction', amount: 600000000, kind: 'project', sources: srcs(WAPO_TRACK) },
  { id: 'donors', count: 37, group: 'Who pays', when: 'Oct 2025', item: 'Private donors, 37 named', payer: 'Amounts not disclosed; Alphabet pledged $22 million of a settlement', amount: null, label: 'Undisclosed', kind: 'private', sources: srcs(CNN_LIST, NBC_LIST, ABC_DONORS) },
  { group: 'Who pays', when: 'June 2026', item: 'Taxpayers, by the contractor\'s estimate', payer: 'Through the Secret Service, the White House Military Office and the Executive Residence', amount: 300000000, kind: 'public', sources: srcs(WAPO_TRACK) },
  { id: 'released', group: 'Who pays', when: 'June 16, 2026', item: 'Released to the Secret Service', payer: 'For "White House Security Measures," from a roughly $1.17 billion appropriation', amount: 351600000, kind: 'public', sources: srcs(RC_SS, WAPO_TRACK) },
  { group: 'Who pays', when: 'May 2026', item: '$1 billion in the DHS funding bill', payer: 'Struck by the Senate parliamentarian', amount: null, label: '$1 billion, struck', kind: 'attempt', sources: srcs(HUFF_ICE, BBC_BYRD) },
  { group: 'Who pays', when: 'Apr 2026', item: 'Customs and national park fees', payer: 'Proposed by Sens. Graham, Schmitt and Britt', amount: null, label: 'Proposed', kind: 'attempt', sources: srcs(INDY_GOP) },
  { group: 'What donors won since', when: 'Six months', item: 'Lockheed Martin', payer: 'New or expanded federal contracts', amount: 43800000000, kind: 'won', sources: srcs(WAPO_PC, MEDIAITE_PC) },
  { group: 'What donors won since', when: 'Six months', item: 'Booz Allen Hamilton', payer: 'New or expanded federal contracts, more than', amount: 4200000000, kind: 'won', sources: srcs(WAPO_PC, MEDIAITE_PC) },
  { id: 'won', group: 'What donors won since', when: 'Six months', item: 'All 14 donors with new business', payer: 'Of 27 publicly identified corporate donors, per Public Citizen, more than', amount: 50000000000, kind: 'won-total', sources: srcs(WAPO_PC, MEDIAITE_PC, TNR_PC) },
];

const dive = {
  slug: 'the-ballroom',
  updated: '2026-09-25',
  trackerIds: IDS,
  section: 'corruption',
  meta: {
    kicker: 'Access',
    title: 'The Ballroom',
    dek: 'Who is paying for the president\'s ballroom, and what have they gotten since? The donors, the public money, the contracts, and a court fight the Supreme Court paused without deciding.',
    status: 'Construction continues under a Supreme Court stay',
    vote: '5-4',
    statusText: 'On August 31 the Supreme Court, 5-4, let construction continue while the National Trust\'s lawsuit goes on, without deciding whether the project is legal. The administration told the Court it was "65% complete in its entirety" and expects to finish by summer 2028. Trump promised in August to name more donors; as of mid-September none had been added to the list of 37.',
  },
  hero: {
    question: 'Who is paying for the president\'s ballroom, and what have they gotten since?',
    answer: 'Thirty-seven donors have been named, with most amounts undisclosed. In the six months after fundraising began, 14 of the 27 publicly identified corporate donors won new or expanded federal contracts worth more than $50 billion, Public Citizen found; that shows overlap, not that any contract was awarded because of a gift. The public is paying too: $351.6 million has been released to the Secret Service for "White House Security Measures."',
    rule: 'Federal law bars any building on federal park grounds in Washington "without express authority of Congress." Congress has not given it, the chief justice wrote in dissent. The Supreme Court let construction continue without deciding whether the project is legal.',
    ruleSources: srcs(ORDER, SB31),
    deck: [
      'In July 2025 the White House announced it would tear down the East Wing and build a ballroom paid for entirely by private donors. The donors were named that fall; what they gave was not. Since then the cost has doubled, public money has been added through security budgets, and a lawsuit reached the Supreme Court, where the chief justice called the construction "likely unlawful" and five justices let it continue anyway.',
      'Below: who pays and how much, the record in order, the explanations set against the documents, who objected and who defended it, the rules that apply, and what to watch. Every fact is sourced. Every opinion is labeled.',
    ],
    quote: {
      lead: 'Asked whether he is building monuments to himself, Trump said, "That\'s true," and:',
      text: 'Nobody will do it once I\'m gone. When I leave here, nobody will.',
      cite: 'President Trump, to New York Magazine, September 2026',
      sources: srcs(CNN_MON, TNR_MON),
    },
  },
  ledger,

  days: [
    { date: '2025-07-31', month: true, events: [
      { actor: 'wh', title: 'The White House announces a ballroom, paid for by private donors',
        body: ['The White House announced it would demolish the historic East Wing and replace it with a ballroom funded entirely by private corporate donors. Cost estimates later rose from $200 million to $300 million and then to $400 million.'],
        sources: srcs(WH_REL, TIME_B, ABC_DONORS) },
    ] },
    { date: '2025-10-20', events: [
      { actor: 'wh', title: 'The East Wing comes down, and the first architect steps aside',
        body: ['Demolition of the East Wing began in the week of October 20. The ballroom\'s first architect, James McCrery II, a Trump appointee to the Commission of Fine Arts, withdrew that week.'],
        sources: srcs(WAPO_ARCH, NBC_LIST) },
    ] },
    { date: '2025-10-23', events: [
      { actor: 'wh', title: 'The donor list: 37 names, no amounts',
        body: ['The White House released the names of 37 donors, among them Apple, Amazon, Google, Microsoft and Meta and defense contractors such as Lockheed Martin, but refused to disclose how much each gave. Alphabet pledged $22 million of a settlement. Ethics watchdogs warned that private funding gives wealthy donors unfair access to the president.'],
        sources: srcs(CNN_LIST, NBC_LIST, FORTUNE) },
    ] },
    { date: '2025-12-15', month: true, events: [
      { actor: 'press', title: 'The National Trust for Historic Preservation sues',
        body: ['The Trust sued in December, a week after the White House finished demolishing the East Wing, arguing that the Constitution and federal statutes require Congress to authorize construction on White House grounds.'],
        sources: srcs(CNBC_WHCD, AP_WHCD) },
    ] },
    { date: '2026-03-31', events: [
      { actor: 'court', title: 'A judge blocks the ballroom: "He is not, however, the owner!"',
        body: ['Judge Richard J. Leon, a George W. Bush appointee, blocked above-ground construction while allowing underground work and anything "strictly necessary" for security. "The President of the United States is the steward of the White House for future generations of First Families. He is not, however, the owner!" He found that "no statute comes close to giving the President the authority he claims to have" and ordered: "Unless and until Congress blesses this project through statutory authorization, construction has to stop!"'],
        sources: srcs(AJ_LEON, SPECTRUM, ABC_LEON) },
    ] },
    { date: '2026-04-11', events: [
      { actor: 'court', title: 'An appeals court lets construction continue',
        body: ['A federal appeals court in Washington paused the injunction before it took effect, and construction went on while the case proceeded.'],
        sources: srcs(NPR_APPEAL, CNN_APPEAL) },
    ] },
    { date: '2026-04-26', events: [
      { actor: 'wh', title: 'After a shooting, the Justice Department asks the Trust to drop the suit',
        body: [
          'Within a day of the shooting at the White House Correspondents\' Dinner, Assistant Attorney General Brett Shumate wrote that the suit "puts the lives of the President, his family, and his staff at great risk" and asked the Trust to dismiss it.',
          'The Trust refused on April 27. Its lawyer, Gregory Craig: "Simply put, this case does not jeopardize the President\'s safety in any way." He added: "And nothing prevents you from asking Congress at any time for the necessary authorization required by the Constitution and federal law."',
        ],
        sources: srcs(CNBC_WHCD, AP_WHCD) },
    ] },
    { date: '2026-04-28', events: [
      { actor: 'congress', title: 'Republican senators propose paying for it with customs and park fees',
        body: ['Sens. Lindsey Graham, Eric Schmitt and Katie Britt pushed a bill to fund the ballroom with customs and national park user fees, and Graham said the White House supports it. In the House, Rep. Lauren Boebert said "hardly any" taxpayer money would be involved.'],
        sources: srcs(INDY_GOP) },
    ] },
    { date: '2026-05-05', events: [
      { actor: 'congress', title: 'A billion dollars for ballroom security goes into an immigration bill',
        body: ['A $72 billion Republican package for immigration enforcement included $1 billion for the ballroom, which, HuffPost reported, the package specifies is "for the Secret Service to use for security-related aspects."'],
        sources: srcs(HUFF_ICE, BBC_BYRD) },
    ] },
    { date: '2026-05-17', events: [
      { actor: 'congress', title: 'The Senate parliamentarian strikes the billion dollars',
        body: ['Parliamentarian Elizabeth MacDonough ruled that the provision failed the Byrd rule, which keeps extraneous items out of budget bills. A spokesman for Majority Leader John Thune: "Redraft. Refine. Resubmit. None of this is abnormal during a Byrd process."'],
        sources: srcs(BBC_BYRD, POL_BYRD) },
    ] },
    { date: '2026-06-04', events: [
      { actor: 'press', title: 'Ballroom donors won $50 billion in contracts, a watchdog finds',
        body: ['Public Citizen found that 14 of the 27 publicly identified corporate donors had won new or expanded federal contracts worth more than $50 billion in the six months after fundraising began, about $43.8 billion of it to Lockheed Martin. It also noted that many of the same companies face federal enforcement actions, or have had them suspended, under this administration.'],
        sources: srcs(WAPO_PC, MEDIAITE_PC, TNR_PC) },
    ] },
    { date: '2026-06-05', events: [
      { actor: 'court', title: 'In the appeals court: "nothing can be done?"',
        body: ['Judge Patricia Millett asked a Justice Department lawyer, as Politico transcribed it: "If the government decides very quickly to bulldoze the Statue of Liberty, the people whose ancestors—that was the first thing they saw coming to this country, but the government moved too fast—nothing can be done?" He answered, "I think that\'s right, yes."'],
        sources: srcs(TNR_BULL, ABC_BULL, LC_BULL) },
    ] },
    { date: '2026-06-16', events: [
      { actor: 'wh', title: 'The budget office releases $351.6 million for "White House Security Measures"',
        body: ['The Office of Management and Budget released $351.6 million to the Secret Service, drawn from a roughly $1.17 billion Secret Service appropriation in the reconciliation package. The construction contractor had estimated roughly $300 million of the project\'s cost would come from taxpayers.'],
        sources: srcs(RC_SS, WAPO_TRACK) },
    ] },
    { date: '2026-08-07', events: [
      { actor: 'court', title: 'The appeals court upholds the injunction, 2-1',
        body: ['"Whether or not a massive ballroom should be constructed is for Congress to decide and is not a matter for Executive self-help," the court wrote. It gave the government 14 days to seek relief from the Supreme Court.'],
        sources: srcs(REUTERS7, CNN31, SB31) },
    ] },
    { date: '2026-08-21', events: [
      { actor: 'court', title: 'The chief justice issues a temporary stay',
        body: ['On the day the injunction would have taken effect, Chief Justice John Roberts put it on hold while the Court considered the government\'s request.'],
        sources: srcs(SB21, CNBC21) },
    ] },
    { date: '2026-08-31', events: [
      { actor: 'court', title: 'The Supreme Court lets it continue, 5-4, without deciding if it is legal',
        body: [
          'The unsigned order found the Trust likely lacks standing: "we have repeatedly held that mere offense, disagreement, or distaste does not qualify as a concrete and particularized injury under Article III." It added, "Today, we do not pass upon the legality of the government\'s East Wing project."',
          'Roberts, joined by Justices Sotomayor, Kagan and Jackson, dissented: "That construction is likely unlawful." He wrote that an appropriation "of a couple million dollars for ordinary Executive Residence maintenance and repairs likely does not authorize the President to use hundreds of millions of dollars in private donations to tear down the East Wing and construct a ballroom in its stead." Trump posted that the Court "has just ruled in favor of the Ballroom/Military Complex being built without any further contingency, doubt, or threat."',
        ],
        sources: srcs(ORDER, SB31, CNN31, NBC31, CNBC31, LI) },
    ] },
    { date: '2026-09-04', events: [
      { actor: 'wh', title: 'Trump on monuments to himself: "That\'s true"',
        body: ['Asked by New York Magazine whether he is building monuments to himself, Trump said, "That\'s true," and "Nobody will do it once I\'m gone." Of the ballroom, he said "the people should be thankful."'],
        sources: srcs(CNN_MON, TNR_MON) },
    ] },
    { date: '2026-09-23', events: [
      { actor: 'press', title: 'A report: the first architect warned about fire exits',
        body: ['The Washington Post reported that McCrery had warned the design gave most guests no way out through the main entrance in an emergency, and that Trump answered, "I am the code." That line rests on two unnamed people; the White House denies that his departure had anything to do with codes. The documents the Post reviewed show a White House official\'s note from a September 30, 2025 meeting: "Life safety — big concern."'],
        sources: srcs(WAPO_ARCH, PEOPLE_ARCH, RD_ARCH) },
    ] },
  ],

  claims: [
    { claim: 'The ballroom would be paid for by private donors.', who: 'Trump, on the ballroom, paraphrased', note: 'His promise, in paraphrase',
      found: 'The public is paying part of it.',
      detail: 'On June 16 the budget office released $351.6 million to the Secret Service for "White House Security Measures." The construction contractor had estimated roughly $300 million of the cost would come from taxpayers. Republicans tried three routes to add public money; the Senate parliamentarian struck one.',
      sources: srcs(RC_SS, WAPO_TRACK, BBC_BYRD) },
    { claim: 'I\'ll give you names.', who: 'Trump, in the Oval Office, August 2026, adding that he had wanted to release them that day',
      found: 'No new names were added.',
      detail: 'As of mid-September, NBC News reported, no donors had been added to the list of 37 released in October 2025, though Nvidia and Vantive Healthcare have acknowledged their own donations. The amounts most donors gave have never been disclosed.',
      sources: srcs(NBC_NAMES) },
    { claim: 'puts the lives of the President, his family, and his staff at great risk', who: 'Brett Shumate, assistant attorney general, on the Trust\'s lawsuit',
      found: 'The injunction exempted security work.',
      detail: 'As the Supreme Court\'s order describes it, the injunction let the government keep building the underground military installation and blocked above-ground construction except as "strictly necessary" to protect the White House, the president and his staff.',
      sources: srcs(ORDER, CNBC_WHCD) },
    { claim: 'has just ruled in favor of the Ballroom/Military Complex being built without any further contingency, doubt, or threat', who: 'Trump, on the Supreme Court\'s order',
      found: 'The Court said it was not deciding whether the project is legal.',
      detail: 'The majority: "Today, we do not pass upon the legality of the government\'s East Wing project." It held only that the Trust likely lacks standing. The lawsuit continues in the lower courts, and four justices said the construction is likely unlawful.',
      sources: srcs(ORDER, CNN31, SB31) },
    { claim: 'life safety issues have been addressed and resolved continuously as the design has evolved', who: 'A White House spokesman, on the architect\'s departure',
      found: 'The White House\'s own notes flagged safety, and still needed the president\'s sign-off after the architect left.',
      detail: 'A White House official\'s notes from a September 30, 2025 meeting read "Life safety — big concern," and notes from November 6 read "Life safety — needs POTUS buy in." The Post could not tell from the records whether the problems have been fixed. The project runs through the Executive Residence, which is not a federal agency, and the District of Columbia cannot enforce building codes on federal property.',
      sources: srcs(WAPO_ARCH) },
  ],

  voices: {
    objected: [
      { who: 'Rep. Alexandria Ocasio-Cortez', role: 'Democrat of New York, on the funding bill', quote: 'He also promised the American people that this was going to be built with private dollars, and so the idea that they are trying to change the rationale for this in retrospect doesn\'t quite add up.', sources: srcs(INDY_GOP) },
      { who: 'Sen. Chuck Schumer', role: 'Senate minority leader, after the parliamentarian\'s ruling', quote: 'Americans don\'t want a ballroom. They don\'t need a ballroom. And they sure as hell should not be forced to pay for one.', sources: srcs(BBC_BYRD) },
      { who: 'Rep. Rosa DeLauro', role: 'Democrat of Connecticut, on the $1 billion in the immigration bill', quote: 'been lying to the public about the cost', sources: srcs(HUFF_ICE) },
      { who: 'Sen. Dick Durbin', role: 'Senate Democratic whip, on the funding bill', quote: 'There\'s obviously a lot of questions about how much it costs, how many people will be accommodated.', sources: srcs(INDY_GOP) },
      { who: 'Gregory Craig', role: 'Lawyer for the National Trust, refusing to drop the suit', quote: 'Simply put, this case does not jeopardize the President\'s safety in any way.', sources: srcs(CNBC_WHCD) },
      { who: 'Kevin Kampschroer', role: 'Fifty years overseeing federal construction at the General Services Administration', quote: 'bottom line is, I don\'t know any commercial building owner that would cheat on the fire code, because the risk is too great.', sources: srcs(WAPO_ARCH) },
    ],
    defended: [
      { who: 'President Trump', role: 'On the ballroom, to New York Magazine', quote: 'the people should be thankful', sources: srcs(CNN_MON) },
      { who: 'Sen. Lindsey Graham', role: 'Republican of South Carolina, on public money for ballroom security', quote: 'It\'s very difficult to have a bunch of important people in the same place unless it\'s really, really secure.', sources: srcs(INDY_GOP) },
      { who: 'Brett Shumate', role: 'Assistant attorney general, to the Trust', quote: 'Your client should voluntarily dismiss this frivolous lawsuit today in light of last night\'s assassination attempt on President Trump.', sources: srcs(CNBC_WHCD) },
      { who: 'A spokesman for Majority Leader John Thune', role: 'After the parliamentarian struck the ballroom money', quote: 'Redraft. Refine. Resubmit. None of this is abnormal during a Byrd process.', sources: srcs(BBC_BYRD) },
      { who: 'Shalom Baranes', role: 'The ballroom\'s current architect', quote: 'I can unequivocally state that the ballroom complex has been designed to conform to applicable national building code standards.', sources: srcs(WAPO_ARCH) },
      { who: 'A person close to Trump', role: 'To CNN, on why he builds', quote: 'Look at Donald Trump\'s life, look at what he\'s done: Built things that no one will ever tear down.', sources: srcs(CNN_MON) },
    ],
  },

  rules: [
    { label: '40 U.S.C. 8106', name: 'Congress decides what gets built', body: 'Federal law bars any "building or structure . . . on any reservation, park, or public grounds of the Federal Government in the District of Columbia without express authority of Congress." The chief justice wrote that "Congress has not passed any law resembling \'express authority\'" for the ballroom. The majority did not reach the question.', sources: srcs(ORDER, SB31) },
    { label: 'Upkeep', name: 'The Executive Residence appropriation', body: 'The administration pointed to Congress\'s appropriation for Executive Residence upkeep. The chief justice: that appropriation "of a couple million dollars for ordinary Executive Residence maintenance and repairs likely does not authorize the President to use hundreds of millions of dollars in private donations to tear down the East Wing and construct a ballroom in its stead."', sources: srcs(ORDER) },
    { label: 'Standing', name: 'Why the Supreme Court let it continue', body: 'Only a party with a concrete injury may sue. The majority held that "mere offense, disagreement, or distaste does not qualify as a concrete and particularized injury under Article III," and so the Trust, suing on a member\'s interests, likely cannot. The dissent answered that a preservationist can be injured by the transformation of a historic building she frequently enjoys.', sources: srcs(ORDER, SB31, NBC31) },
    { label: 'Residence', name: 'Outside the agency rules', body: 'The ballroom is being built through the Executive Residence, a small office that is not a federal agency and so falls outside the rules that bind agencies. The District of Columbia cannot enforce its building codes on federal property.', sources: srcs(WAPO_ARCH) },
    { label: 'Byrd rule', name: 'The Senate\'s budget rule', body: 'Budget reconciliation bills pass with 51 votes but may not carry extraneous items. The parliamentarian struck the $1 billion for ballroom security because the spending fell outside the jurisdiction of the Senate Judiciary Committee, which brought the bill.', sources: srcs(BBC_BYRD, POL_BYRD) },
  ],

  watch: [
    { when: 'Open', title: 'The lawsuit', text: 'The Supreme Court decided only that construction may continue while the case goes on. Whether the ballroom is legal is still before the lower courts.', sources: srcs(ORDER) },
    { when: 'Open', title: 'The donor names and amounts', text: 'In August Trump promised to name more donors: "I\'ll give you names." As of mid-September none had been added to the list of 37, and most amounts have never been disclosed.', sources: srcs(NBC_NAMES) },
    { when: 'Open', title: 'More public money', text: 'The $351.6 million released in June came from a roughly $1.17 billion Secret Service appropriation. Watch for further releases tied to the project.', sources: srcs(RC_SS) },
    { when: 'Summer 2028', title: 'Completion', text: 'The administration says the roughly $400 million project is expected by summer 2028.', sources: srcs(NBC_NAMES) },
  ],

  take: [
    'The ballroom was presented to the public as a gift. The record shows a building whose donors are named but whose gifts are not, whose donors have done well with the government since, and whose cost is increasingly carried by the public through security budgets.',
    'Nothing in the record shows a contract awarded in exchange for a donation, and this page does not claim one. The problem is the arrangement. When companies with business before the government pay for the president\'s own project, in amounts he keeps private, nobody outside can check whether anything was bought. Disclosure rules exist to prevent exactly that, and this project was set up to sit outside them.',
    'The courts have not said the ballroom is legal. Five justices said the people who sued probably could not; four said it is probably unlawful. Meanwhile it goes up twenty hours a day. The question Congress was supposed to answer first is being answered by construction.',
  ],

  corrections: [
    { date: '2026-09-24', text: 'Before this page was published, the quotations and figures in its seed entries were checked against the saved text of their sources. The main ballroom entry quoted Judge Leon as calling the donor funding a "Rube Goldberg machine"; as Reason reported it, he described it as a "Rube Goldberg contraption," and a quotation of his finding on presidential authority had been cut short before "to have."' },
    { date: '2026-09-24', text: 'The entry on the $72 billion bill put "ballroom security-related aspects" in quotation marks as the bill\'s wording; the phrase was HuffPost\'s description of the package. The architect entry said the November 6 notes came "five weeks" after McCrery left; the Post does not say so, and the gap was a little over two weeks.' },
    { date: '2026-09-25', text: 'The main ballroom entry said Judge Leon\'s injunction halted all construction. It blocked above-ground construction and allowed underground work, as the Supreme Court\'s order describes it, and it never took effect.' },
  ],
};

fs.writeFileSync(OUT, JSON.stringify(dive, null, 2) + '\n');
const n = [...JSON.stringify(dive).matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
console.log('wrote', OUT, '|', dive.days.reduce((k, d) => k + d.events.length, 0), 'events |', new Set(n).size, 'unique sources');
