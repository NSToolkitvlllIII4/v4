// "Public" (no account): the subject has no account, but turned up in someone else's public post, photo or video.
// (Stored as accountType "no-page"; the wording is unchanged and will be updated later.)
import { article } from '../helpers/grammar.js';

export const noAccount = (c) => {
  if (c.data.accountType !== 'no-page') return null;

  const media = c.data.mentionMedia || 'public post/s';
  return `The subject did not appear to have ${article(c.named).toLowerCase()} ${c.named} account; however, ${c.proSubj} was identified on (a) ${media}. This/These was/were identified by ${c.idBy}. ${c.findings}`;
};
