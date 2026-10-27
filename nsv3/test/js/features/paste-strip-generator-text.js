// Quill fields: drop the generator's wording from pasted text,
// a leading "Match found by" and a trailing period.
import { addPasteTransform } from '../lib/paste-pipeline.js';

export const name = 'paste-strip-generator-text';

const strip = (str) => (str ? str.replace(/^\s*Match found by\s+/i, '').replace(/\.\s*$/, '') : str);

export function register() {
  addPasteTransform({
    name,
    order: 30,
    run(ctx) {
      if (ctx.kind !== 'quill') return;
      if (ctx.insertHtml) ctx.insertHtml = strip(ctx.insertHtml);
      else ctx.text = strip(ctx.text);
    },
  });
}
