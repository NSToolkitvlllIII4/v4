// The one place HTML gets sanitized. Everything that shows or copies report HTML goes through here.
import DOMPurify from '../vendor/purify.es.mjs';

// Every link in the report opens in a new tab, safely.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName && node.tagName.toLowerCase() === 'a') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitize(html = '', config = {}) {
  return DOMPurify.sanitize(String(html), config);
}
