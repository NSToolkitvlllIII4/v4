// Link fields ([data-type="hyperlink"]): when the clipboard holds a rich link
// (copied from Slack, a web page, etc.), paste its URL instead of its label text.
import { addPasteTransform } from '../lib/paste-pipeline.js';
import { sanitize } from '../lib/sanitize.js';

export const name = 'paste-link-extractor';

export function register() {
  addPasteTransform({
    name,
    order: 10,
    run(ctx) {
      if (!ctx.isLink || !ctx.html) return;
      const clean = sanitize(ctx.html, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href'] });
      // DOMParser builds an inert document: nothing in it runs or loads.
      const href = new DOMParser().parseFromString(clean, 'text/html').querySelector('a[href]')?.getAttribute('href');
      if (href) ctx.text = href;
    },
  });
}
