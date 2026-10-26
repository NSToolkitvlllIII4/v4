// All the network paragraphs, in the order of js/config/networks.js, one per account.
// Wording lives in one file per network; the exceptions (possible, no account) have their own files.
import { networks } from '../../config/networks.js';
import { buildContext } from './context.js';
import { possible } from './possible.js';
import { noAccount } from './no-account.js';
import { business, personalPage } from './page.js';
import { facebook } from './facebook.js';
import { simple } from './simple.js';
import { twitter } from './twitter.js';
import { youtube } from './youtube.js';
import { linkedin } from './linkedin.js';
import { generic } from './generic.js';
import { other } from './other.js';
import { googleParagraphs } from './google/index.js';

// Which wording each network uses. Networks not listed here use generic.
const WORDING = { fb: facebook, ig: simple, tk: simple, thr: simple, pin: simple, tw: twitter, yt: youtube, li: linkedin, other };

// Each paragraph with the ids of the accounts it was written from: { html, owner: [id, ...] }.
// (The owner lets the page find the bullet that belongs to an account; see features/clone-highlight.js.)
export function networkEntries({ networks: state = {}, subjectGender }) {
  const isMale = subjectGender === 'male';
  const paragraphs = [];
  const personalPageParagraphs = []; // personal pages: after all the accounts, before the business pages
  const businessParagraphs = [];     // business pages (and Google business websites): last

  for (const net of networks) {
    const st = state[net.id];
    if (!st?.checked) continue;

    if (net.id === 'goog') {                // search results, not accounts: their own wording
      const google = googleParagraphs(st.instances, { isMale });
      paragraphs.push(...google.regular);
      personalPageParagraphs.push(...google.personalPages);
      businessParagraphs.push(...google.business);
      continue;
    }

    const counters = {};                    // repeats of the same kind of account: 2nd, 3rd, ...
    for (const data of st.instances) {
      const ctx = buildContext(net, data, counters, isMale);
      const owner = [data.id];
      if (ctx.isPersonalPage) { personalPageParagraphs.push({ html: personalPage(ctx), owner }); continue; }
      if (ctx.isBiz) { businessParagraphs.push({ html: business(ctx), owner }); continue; }
      paragraphs.push({ html: possible(ctx) ?? noAccount(ctx) ?? (WORDING[net.id] ?? generic)(ctx), owner });
    }
  }
  return [...paragraphs, ...personalPageParagraphs, ...businessParagraphs];
}

// Just the text of each paragraph
export const networkParagraphs = (state) => networkEntries(state).map((e) => e.html);
