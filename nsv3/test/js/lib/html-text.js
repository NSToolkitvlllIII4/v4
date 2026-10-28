// HTML -> plain text, without running or loading anything in it.
export function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
}
