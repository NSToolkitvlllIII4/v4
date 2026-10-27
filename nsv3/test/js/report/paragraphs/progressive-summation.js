// Progressive report, bullet 3: the summation (bold).
//   "In summation, 2 personal social media accounts and Google search results were identified for the party.
//    After a thorough investigation, no apparent relevant information regarding the party’s accident on [Date] was found
//    at this time, nor were any social media posts pertaining to his injuries, treatment, or activities."
// A Null report says the party did not appear to have any personal social media.
import { buildTally } from '../tally.js';
import { joinList } from '../helpers/text.js';

export const name = 'progressive-summation';

const plural = (n, one, many) => (n === 1 ? one : many);

export const progressiveSummation = (state) => {
  const poss = state.subjectGender === 'male' ? 'his' : 'her';
  const noRH = `no apparent relevant information regarding the party’s accident on [Date] was found at this time, nor were any social media posts pertaining to ${poss} injuries, treatment, or activities.`;

  if (state.isNull) {
    return `<strong>In summation, the party did not appear to have any forms of personal social media. After a thorough investigation, ${noRH}</strong>`;
  }

  const { tally: t, progressive: p } = buildTally(state);
  const social = t.personalCount + t.possibleSocialCount;

  // Strict order: accounts, public posts, personal pages, business pages, Mugshots, business websites, Google.
  // Each item also says how many things it stands for, which decides "was" or "were".
  const items = [
    social > 0 && [`${social} personal social media ${plural(social, 'account', 'accounts')}`, social],
    t.hasMentions && ['public posts, photos, and videos', 2],
    t.personalPageCount > 0 && [`${t.personalPageCount} personal ${plural(t.personalPageCount, 'page', 'pages')}`, t.personalPageCount],
    t.businessCount > 0 && [`${t.businessCount} business ${plural(t.businessCount, 'page', 'pages')}`, t.businessCount],
    p.mugshots > 0 && [plural(p.mugshots, 'a Mugshot', 'multiple Mugshots'), p.mugshots === 1 ? 1 : 2],
    t.googleBusinessCount > 0 && [plural(t.googleBusinessCount, 'a business website', `${t.googleBusinessCount} business websites`), t.googleBusinessCount],
    p.google && ['Google search results', 2],
  ].filter(Boolean);

  const units = items.reduce((sum, [, n]) => sum + n, 0);
  const list = joinList(items.map(([text]) => text)) || 'no accounts';
  const verb = units === 1 ? 'was' : 'were';
  const ending = t.hasGlobalRH ? '(state what was found/not found).' : noRH;
  return `<strong>In summation, ${list} ${verb} identified for the party. After a thorough investigation, ${ending}</strong>`;
};
