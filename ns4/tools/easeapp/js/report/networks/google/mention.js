// "Public" (no account) results: the subject turned up in someone else's public post, photo or video.
import { pseNames } from './pse-names.js';
import { identifiedBy, relevantInfo, ordinalPrefix } from './shared.js';
import { article } from '../../helpers/grammar.js';

export const googleMention = (data, position, { proSubj }) => {
  const named = ordinalPrefix(position) + (data.matchStatus === 'possible' ? 'possible ' : '') + pseNames(data.pseNames);
  const findings = data.finding === 'none'
    ? 'No apparent relevant information regarding the case was found on it/them at this time.'
    : `<strong>${relevantInfo(data)}</strong>`;

  const media = data.mentionMedia || 'public post/s';
  const p = `The subject did not appear to have ${article(named).toLowerCase()} ${named} account; however, ${proSubj} was identified on (a) ${media}. `;
  return p + `This/These was/were identified by ${identifiedBy(data)}. ${findings}`;
};
