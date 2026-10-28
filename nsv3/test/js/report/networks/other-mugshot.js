// Mugshot: where, when and why the subject was booked. (Reads "A Mugshot was identified", not "account".)
import { article } from '../helpers/grammar.js';

export const otherMugshot = (c) => {
  const where = c.value(c.data.countyState, 'Hillsborough County, Florida');
  const when = c.value(c.data.arrestDate, '11/05/2002');
  const charge = c.value(c.data.charge, '(Charge Description)');
  return `${article(c.named)} ${c.named} was identified by ${c.idBy}. ${c.metrics}The subject was booked in ${where} on ${when} for ${charge}. ${c.findings}`;
};
