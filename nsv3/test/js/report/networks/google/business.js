// A business website, business page or personal page that shows up in search results.
// Same sentence for all; only the words change ("business website", "business page", "personal page").
import { pseNames } from './pse-names.js';
import { identifiedBy, relevantInfo, ordinalPrefix } from './shared.js';

//   kind  'website' | 'page'     owner  'business' | 'personal'
// Only a business has the "contains information about the business" line.
export const googleBusiness = (data, position, kind = 'website', owner = 'business') => {
  const ord = ordinalPrefix(position);
  const idBy = identifiedBy(data);
  const engines = pseNames(data.pseNames);
  const findings = data.finding === 'none'
    ? 'No apparent relevant information regarding the case was found on it at this time.'
    : `<strong>${relevantInfo(data)}</strong>`;

  if (data.matchStatus === 'possible') {
    return `A ${ord}possible ${owner} ${kind} on ${engines} was found by ${idBy}. ${findings}`;
  }
  const about = owner === 'business' ? ` This ${kind} contains information about the business.` : '';
  return `A ${ord}${owner} ${kind} on ${engines} was identified by ${idBy}.${about} ${findings}`;
};
