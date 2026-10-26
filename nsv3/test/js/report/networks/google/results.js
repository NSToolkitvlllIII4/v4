// Google / public search engine results about the subject (personal results).
// Wording changes for one or several results, matched or possible, and for Google reviews.
import { pseNames, pseText } from './pse-names.js';
import { identifiedBy, relevantInfo, informationFound } from './shared.js';

export function googleResult(data) {
  const many = data.resultType === 'multiple';
  const possible = data.matchStatus === 'possible';
  const engines = pseNames(data.pseNames);
  const idBy = identifiedBy(data);
  const info = informationFound(data);

  const were = many ? 'were' : 'was';
  const contains = many ? 'These search results contain' : 'This search result contains';
  const it = many ? 'them' : 'it';

  // Google itself: the results are reviews the subject posted
  if (pseText(data.pseNames).toLowerCase() === 'google') {
    const lead = possible
      ? (many ? 'Possible public search engine results' : 'A possible public search engine result')
      : (many ? 'Public search engine results' : 'A public search engine result');
    let p = `${lead} found on ${engines} ${were} identified by ${idBy}. ${contains} reviews posted by the subject.`;
    p += data.finding === 'none'
      ? ` No apparent relevant information regarding the case was found on ${it} at this time.`
      : ` <strong>${relevantInfo(data)}</strong>`;
    return p;
  }

  if (possible) {
    const lead = many ? 'Possible public search engine results' : 'A possible public search engine result';
    return `${lead} on ${engines} ${were} found by ${idBy}. ${contains} possible ${info} information about the subject and no apparent relevant information regarding the case was found on ${it} at this time.`;
  }

  const lead = many ? 'Public search engine results' : 'A public search engine result';
  let p = `${lead} found on ${engines} ${were} identified by ${idBy}. ${contains} ${info} information about the subject`;
  p += data.finding === 'none'
    ? ` and no apparent relevant information regarding the case was found on ${it} at this time.`
    : `. <strong>${relevantInfo(data)}</strong>`;
  return p;
}

// Who each paragraph from googleResultParagraphs belongs to (lists of instance ids, same order).
export function googleResultOwners(personal) {
  const matched = personal.filter((d) => d.matchStatus !== 'possible');
  const possible = personal.filter((d) => d.matchStatus === 'possible');
  const out = [];
  if (matched.length) out.push(matched.map((d) => d.id)); // matched sets share one paragraph
  for (const d of possible) out.push([d.id]);
  return out;
}

// Several matched sets are introduced together; possible ones follow, one each.
export function googleResultParagraphs(personal) {
  const matched = personal.filter((d) => d.matchStatus !== 'possible');
  const possible = personal.filter((d) => d.matchStatus === 'possible');
  const out = [];

  if (matched.length === 1) out.push(googleResult(matched[0]));
  else if (matched.length > 1) {
    const header = `Public search engine results were identified by ${matched.length} sets of identifiers:`;
    out.push(header + '<br><br>' + matched.map(googleResult).join('<br><br>'));
  }
  for (const d of possible) out.push(googleResult(d));
  return out;
}
