// The report engine: pure functions, no DOM, no Alpine.
// state in -> list of paragraphs (HTML strings) out. One file per paragraph in ./paragraphs/.
// Anything typed by a person that goes into a paragraph must be HTML-escaped first
// (the pane also sanitizes, but escape at the source).
//
// To add a paragraph: write it as (state) => string | null in ./paragraphs/, then add it to the
// list for its report type below. Order in the list = order in the report.
// A paragraph may return a string, null/empty (skipped), or a list of strings (several paragraphs).
import { plusIntro } from './paragraphs/plus-intro.js';
import { progressiveIntro } from './paragraphs/progressive-intro.js';
import { relativesPlus } from './paragraphs/relatives-plus.js';
import { relativesProgressive } from './paragraphs/relatives-progressive.js';
import { networksPlus } from './paragraphs/networks-plus.js';
import { closingPlus } from './paragraphs/closing-plus.js';

export const paragraphsByType = {
  plus: [
    plusIntro,
    relativesPlus,
    networksPlus,
    closingPlus,
  ],
  progressive: [
    progressiveIntro,
    relativesProgressive,
    // summation: added in a later slice
  ],
};

// Every paragraph with the ids of the accounts it was written from (null for paragraphs about nothing in particular).
// A paragraph function can list those ids by having an `owners(state)` function next to it (see networks-plus.js).
export function buildEntries(state) {
  const list = paragraphsByType[state.reportType] ?? paragraphsByType.plus;
  return list.flatMap((paragraph) => {
    const items = [paragraph(state)].flat();
    const owners = paragraph.owners ? paragraph.owners(state) : [];
    return items.map((html, i) => ({ html, owner: owners[i] ?? null }));
  }).filter((e) => e.html);
}

export function buildParagraphs(state) {
  return buildEntries(state).map((e) => e.html);
}
