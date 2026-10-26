// Removes "<" and ">" from pasted text. (Rich HTML inserted by paste-quill-links is already sanitized.)
import { addPasteTransform } from '../lib/paste-pipeline.js';
import { stripBrackets } from '../lib/text-fields.js';

export const name = 'paste-strip-brackets';

export function register() {
  addPasteTransform({
    name,
    order: 90,
    run(ctx) {
      if (!ctx.insertHtml && ctx.text) ctx.text = stripBrackets(ctx.text);
    },
  });
}
