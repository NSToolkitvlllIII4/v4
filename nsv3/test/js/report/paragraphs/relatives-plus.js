// Plus report: the relatives paragraph.
import { escapeHtml, joinList } from '../helpers/text.js';
import { nameHtml } from '../helpers/links.js';
import { validRows, countWords } from '../helpers/relatives.js';

export const name = 'relatives-plus';

export const relativesPlus = ({ relatives: rel }) => {
  const scope = rel.scope === 'both' ? 'relatives and associates' : 'relatives';

  if (rel.found !== true) {
    return `Searches for the subject's ${scope} were also performed, but none were positively identified at this time.`;
  }

  const rows = validRows(rel.rows);
  if (rows.length === 0) return null; // "Yes" chosen but no names entered yet: say nothing

  const { verb, noun, pronoun } = countWords(rows.length);
  const names = joinList(rows.map((r) => nameHtml(r.name, r.link)));
  let text = `Searches for the subject's ${scope} were also performed and ${rows.length} ${verb} identified: ${names}. `;

  if (rel.finding === 'none') {
    text += `${noun} thoroughly investigated and no apparent relevant information regarding the case was found on ${pronoun} at this time.`;
  } else {
    const details = (rel.rhText || '').trim() ? escapeHtml(rel.rhText.trim()) : '(relevant information was found.)';
    text += `<strong>${noun} thoroughly investigated and ${details}</strong>`;
  }
  return text;
};
