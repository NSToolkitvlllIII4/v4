// Quill fields: when the clipboard holds links, keep them as links (nothing else survives).
import { addPasteTransform } from '../lib/paste-pipeline.js';
import { sanitize } from '../lib/sanitize.js';

export const name = 'paste-quill-links';

export function register() {
  addPasteTransform({
    name,
    order: 20,
    run(ctx) {
      if (ctx.kind !== 'quill' || !/<a[\s>]/i.test(ctx.html)) return;
      const clean = sanitize(ctx.html, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href'] });
      if (clean) ctx.insertHtml = clean;
    },
  });
}
