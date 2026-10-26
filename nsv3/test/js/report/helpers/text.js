// Small text helpers shared by report paragraphs. Pure.
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Anything a person typed must go through this before it is put into report HTML.
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

// ["a"] -> a   ["a","b"] -> a and b   ["a","b","c"] -> a, b, and c
export function joinList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(' and ');
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// Joins several findings into one passage, with a transition word before each extra one.
const TRANSITIONS = ['Along with this,', 'In addition,', 'Furthermore,'];
export function stitch(texts) {
  let out = texts[0];
  for (let i = 1; i < texts.length; i++) out += ` ${TRANSITIONS[(i - 1) % TRANSITIONS.length]} ${texts[i]}`;
  return out;
}
