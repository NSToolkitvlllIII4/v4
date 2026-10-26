// The report as it is pasted into other apps (email, Word, tickets).
// These styles are inline on purpose: other apps ignore our stylesheet.
// (The on-screen report uses classes instead, because this page's CSP blocks inline styles.)
const UL = 'list-style-type: disc; padding-left: 20px; margin: 0;';
const LI = 'margin-bottom: 0;';
const GAP = 'list-style: none; margin: 0;'; // a blank line between bullets
const LINK = 'color: #0563c1; text-decoration: underline;'; // the blue other apps expect for links

export function clipboardHtml(paragraphs) {
  const items = paragraphs.map((p) => `<li style='${LI}'>${p.replace(/<a /g, `<a style='${LINK}' `)}</li>`);
  return `<ul style='${UL}'>${items.join(`<li style='${GAP}'><br></li>`)}</ul>`;
}
