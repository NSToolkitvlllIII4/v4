// The report as it is pasted into other apps (email, Word, tickets).
// These styles are inline on purpose: other apps ignore our stylesheet.
// (The on-screen report uses classes instead, because this page's CSP blocks inline styles.)
const UL = 'list-style-type: disc; padding-left: 20px; margin: 0;';
const LI = 'margin-bottom: 0;';
const LINK = 'color: #0563c1; text-decoration: underline;'; // the blue other apps expect for links

// The blank line between bullets is two line breaks at the end of the bullet itself (what Shift+Enter twice gives in a
// rich text editor), not an extra empty list item. Editors such as TinyMCE drop inline styles like "list-style: none",
// so an empty spacer item came out as an empty bullet. The last bullet has no trailing break.
export function clipboardHtml(paragraphs) {
  const last = paragraphs.length - 1;
  const items = paragraphs.map((p, i) =>
    `<li style='${LI}'>${p.replace(/<a /g, `<a style='${LINK}' `)}${i < last ? '<br><br>' : ''}</li>`);
  return `<ul style='${UL}'>${items.join('')}</ul>`;
}
