// A possible (unconfirmed) account: one short sentence, whatever else was filled in.
import { article } from '../helpers/grammar.js';

export const possible = (c) => {
  if (!c.isPossible) return null;
  return `${article(c.named)} ${c.named} account was found by ${c.idBy}. No apparent relevant information regarding the case was found on this possible account at this time.`;
};
