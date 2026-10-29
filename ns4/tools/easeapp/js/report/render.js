// Paragraphs -> the HTML shown in the report pane.
// Classes only (no inline styles): the page's CSP blocks style attributes.
// The copy feature will build its own version with inline styles for pasting into other apps.
// Takes strings, or { html, owner } entries. An owner (list of account ids) becomes  data-owners="1 4"  on the bullet.
export function renderList(paragraphs) {
  if (!paragraphs.length) return '';
  const item = (p) => {
    if (typeof p === 'string') return `<li>${p}</li>`;
    const owners = (p.owner ?? []).filter((id) => /^\d+$/.test(String(id))).join(' ');
    return `<li${owners ? ` data-owners="${owners}"` : ''}>${p.html}</li>`;
  };
  return `<ul class="report-list">${paragraphs.map(item).join('')}</ul>`;
}
