// All the Google / public search engine paragraphs, as { html, owner, tier, slot } entries
// (report/order.js puts them in place; config/hierarchy.js sets the order):
//   results (matched sets share one paragraph, possible ones follow) and "no account" mentions: tier "google"
//   pages and websites: the tier of their kind, so personal pages sit with the other personal pages, and so on.
import { tierFor } from '../../order.js';
import { googleResultParagraphs, googleResultOwners } from './results.js';
import { googleBusiness } from './business.js';
import { googleMention } from './mention.js';

// Pages and websites on Google. The key is the account type; add fan-page, personal-website and fan-website here
// when they exist. kind: the word in the sentence; owner: who it belongs to ("A personal page ...").
const PAGE_KINDS = {
  'personal-page': { kind: 'page', owner: 'personal' },
  'business-page': { kind: 'page', owner: 'business' },
  'business-website': { kind: 'website', owner: 'business' },
};

export function googleParagraphs(instances, { isMale }) {
  const personal = instances.filter((d) => d.accountType === 'personal');
  const mentions = instances.filter((d) => d.accountType === 'no-page'); // Public
  const pronouns = { proSubj: isMale ? 'he' : 'she' };
  const entry = (html, owner, accountType, slot) => ({ html, owner, tier: tierFor('goog', accountType), slot });
  const out = [];

  const results = googleResultParagraphs(personal);
  const meta = googleResultOwners(personal);
  results.forEach((html, i) => out.push(entry(html, meta[i].owner, 'personal', meta[i].slot)));

  mentions.forEach((d, i) => out.push(entry(googleMention(d, i + 1, pronouns), [d.id], 'no-page', 'extra')));

  // Each kind counts its own 1st, 2nd, ...
  for (const [accountType, { kind, owner }] of Object.entries(PAGE_KINDS)) {
    instances.filter((d) => d.accountType === accountType).forEach((d, i) => {
      out.push(entry(googleBusiness(d, i + 1, kind, owner), [d.id], accountType, d.matchStatus === 'possible' ? 'possible' : 'matched'));
    });
  }
  return out;
}
