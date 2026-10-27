// Progressive report, bullet 1: the intro, then what was found.
//   Null report: "No social media accounts were found for the party at this time."
//   Otherwise a sentence that names where accounts were found, then the findings typed on the networks:
//     "Social media accounts for the party were found on Facebook and X (Twitter); he was also found to have a business page
//      on Yelp, a Mugshot, and Google search results. <bold findings>"
import { buildTally } from '../tally.js';
import { escapeHtml, joinList, stitch } from '../helpers/text.js';

export const name = 'progressive-intro';

const INTRO =
  `Searches of multiple social media sites including but not limited to Facebook, Instagram, X (Twitter), YouTube, LinkedIn, TikTok, Pinterest, Strava, Foursquare, and Tumblr, in addition to an in-depth Google search was performed with a specific analysis focused on the aforementioned categories. All provided information, as well as discovered information, was utilized in the search.`;

const NULL_SENTENCE = ` No social media accounts were found for the party at this time.`;

const unique = (list) => [...new Set(list)];

// "a business page on Yelp" / "business pages on Yelp and Etsy": one network = "a ...", more than one = plural
function onNetworks(nets, one, many) {
  const names = unique(nets);
  if (names.length === 0) return null;
  return `${names.length === 1 ? one : many} on ${joinList(names.map(escapeHtml))}`;
}

// The sentence about where accounts were found
function accountsSentence(p, he) {
  const personal = unique(p.personalNets);
  const mentions = unique(p.mentionNets);

  // Things found besides accounts, in this order
  const extras = [
    onNetworks(p.personalPageNets, 'a personal page', 'personal pages'),
    onNetworks(p.businessNets, 'a business page', 'business pages'),
    onNetworks(p.websiteNets, 'a business website', 'business websites'),
    p.mugshots > 0 ? (p.mugshots === 1 ? 'a Mugshot' : 'multiple Mugshots') : null,
    p.google ? 'Google search results' : null,
  ].filter(Boolean);

  let sentence;
  if (personal.length && mentions.length) {
    sentence = `Social media accounts for the party were found on ${joinList(personal.map(escapeHtml))}, and ${he} was identified on public posts, photos, and videos on ${joinList(mentions.map(escapeHtml))}`;
  } else if (personal.length) {
    sentence = `Social media accounts for the party were found on ${joinList(personal.map(escapeHtml))}`;
  } else if (mentions.length) {
    sentence = `No social media accounts were found for the party at this time; however, ${he} was identified on public posts, photos, and videos on ${joinList(mentions.map(escapeHtml))}`;
  } else {
    sentence = 'No social media accounts were found for the party at this time';
  }

  if (extras.length) {
    if (personal.length) sentence += `; ${he} was also found to have ${joinList(extras)}`;
    else if (mentions.length) sentence += `, and was also found to have ${joinList(extras)}`; // no second "however"
    else sentence += `; however, ${he} was found to have ${joinList(extras)}`;
  }
  return `${sentence}.`;
}

export const progressiveIntro = (state) => {
  if (state.isNull) return INTRO + NULL_SENTENCE;

  const { tally, progressive, allProgTexts } = buildTally(state);
  const he = state.subjectGender === 'male' ? 'he' : 'she';
  let text = `${INTRO} ${accountsSentence(progressive, he)}`;

  // What was found on the networks, in bold (typed in "Progressive findings")
  const findings = allProgTexts.map(escapeHtml);
  if (findings.length > 0) text += ` <strong>${stitch(findings)}</strong>`;
  else if (tally.hasNetworkRH) text += ' <strong>(state RH in bold, if any)</strong>';
  return text;
};
