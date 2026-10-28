// Everything a network sentence needs, worked out once per account. Pure.
// `counters` is shared by all accounts of one network, so repeats get "2nd", "3rd", ...
import { escapeHtml, joinList } from '../helpers/text.js';
import { article, ordinal } from '../helpers/grammar.js';
import { getOtherType } from '../../config/other-types.js';
import { metricItems } from './metrics.js';

const value = (text, fallback) => escapeHtml(text || fallback);

// The name used in the sentence: the network's, or for "other" accounts the kind's (or the site name typed in)
function displayName(net, data) {
  if (net.id !== 'other') return net.name;
  const type = getOtherType(data.subType);
  if (type?.named) return data.networkName || 'SOCMED';
  return type?.name ?? net.name;
}

export function buildContext(net, data, counters, isMale) {
  const isPossible = data.matchStatus === 'possible';
  const isBiz = data.accountType === 'business-page';
  const isPersonalPage = data.accountType === 'personal-page';
  const isPage = isBiz || isPersonalPage; // written as "A personal page on ..." / "A business page on ..."
  const name = displayName(net, data);

  // "2nd" / "3rd" for the 2nd / 3rd account of the same kind on the same network
  const key = `${data.accountType || 'personal'}_${isPossible ? 'poss' : 'match'}_${name.toLowerCase()}`;
  counters[key] = (counters[key] || 0) + 1;
  const ord = counters[key] > 1 ? ordinal(counters[key]) + ' ' : '';
  const prefix = ord + (isPossible ? 'possible ' : '');
  const named = prefix + name;

  const proSubj = isBiz ? 'the business' : (isMale ? 'he' : 'she');
  const proSubjCap = isBiz ? 'The business' : (isMale ? 'He' : 'She');
  const proPoss = isBiz ? 'its' : (isMale ? 'his' : 'her');

  const idBy = (data.idBy || '').trim() ? data.idBy.trim() : '(identifiers)';

  // The "relevant / no relevant information" sentence
  let findings;
  if (data.finding === 'none') {
    const noAccount = data.accountType === 'no-page'; // Public
    const target = isPage ? 'it' : (noAccount ? 'it/them' : 'this account');
    findings = `No apparent relevant information regarding the case was found on ${target} at this time.`;
  } else {
    const rh = (data.mediaType || '').trim() ? escapeHtml(data.mediaType.trim()) : '(Relevant information was found.)';
    findings = `<strong>${rh}</strong>`;
  }

  // "This account has 5 posts, 2 friends, and 1 follower. "
  const items = metricItems(net, data, { proSubj, isMale });
  const metrics = items.length ? `This account has ${joinList(items)}. ` : '';

  // "The account was last active on ... "
  let activity = '';
  if (data.activity === 'inactive') activity = 'The account is inactive. ';
  else if (data.activity === 'private') activity = 'The account is set to private. ';
  else if (data.activity === 'active') {
    const d = value(data.actDate, '(Month Day, Year)');
    const a = value(data.actDetails, '(shared a post/photo etc)');
    if (net.id === 'pin') activity = `The account was last active on ${d} when the subject saved a pin. `;
    else if (net.id === 'other' && data.subType === 'ecommerce') activity = `The account was last active on ${d}. `;
    else activity = `The account was last active on ${d} when the subject ${a}. `;
  }

  return {
    net, data, isPossible, isBiz, isPersonalPage, isPage, name, ord, prefix, named, metricItems: items,
    proSubj, proSubjCap, proPoss, idBy, findings, metrics, activity,
    opening: `${article(named)} ${named} account was identified by ${idBy}. `,
    value,
  };
}
