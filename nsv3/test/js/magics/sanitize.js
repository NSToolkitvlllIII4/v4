// Use in markup:  x-html="$sanitize(someHtml)"
import { sanitize } from '../lib/sanitize.js';

export const name = 'sanitize-magic';

export function register(Alpine) {
  Alpine.magic('sanitize', () => sanitize);
}
