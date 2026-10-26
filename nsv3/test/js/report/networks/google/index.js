// All the Google / public search engine paragraphs, grouped the way the report reads:
//   results (matched, then possible) and "no account" mentions go with the other paragraphs,
//   personal pages go after those (before the business pages),
//   business websites, then business pages, go at the end with the other business accounts.
import { googleResultParagraphs, googleResultOwners } from './results.js';
import { googleBusiness } from './business.js';
import { googleMention } from './mention.js';

export function googleParagraphs(instances, { isMale }) {
  const personal = instances.filter((d) => d.accountType === 'personal');
  const personalPages = instances.filter((d) => d.accountType === 'personal-page');
  const websites = instances.filter((d) => d.accountType === 'business');        // business website
  const pages = instances.filter((d) => d.accountType === 'business-page');      // business page
  const mentions = instances.filter((d) => d.accountType === 'no-page'); // Public
  const pronouns = { proSubj: isMale ? 'he' : 'she' };

  // Each paragraph comes with the ids of the accounts it was written from: { html, owner: [id, ...] }
  const results = googleResultParagraphs(personal);
  const resultOwners = googleResultOwners(personal);
  return {
    regular: [
      ...results.map((html, i) => ({ html, owner: resultOwners[i] })),
      ...mentions.map((d, i) => ({ html: googleMention(d, i + 1, pronouns), owner: [d.id] })),
    ],
    // Websites first, then pages; each kind counts its own 1st, 2nd, ...
    personalPages: personalPages.map((d, i) => ({ html: googleBusiness(d, i + 1, 'page', 'personal'), owner: [d.id] })),
    business: [
      ...websites.map((d, i) => ({ html: googleBusiness(d, i + 1, 'website'), owner: [d.id] })),
      ...pages.map((d, i) => ({ html: googleBusiness(d, i + 1, 'page'), owner: [d.id] })),
    ],
  };
}
