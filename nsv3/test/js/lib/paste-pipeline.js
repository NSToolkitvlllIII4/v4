// Registry for paste transforms. Each edge case is its own file that registers here.
// A transform: { name, order, run(ctx) }. Lower order runs first. It edits ctx in place:
//   ctx.text        plain text that will be inserted
//   ctx.html        the clipboard's HTML (read only)
//   ctx.insertHtml  set to a string to insert rich HTML instead of text
//   ctx.target, ctx.host, ctx.kind ('native' | 'quill' | 'editable'), ctx.isLink
const transforms = [];

export function addPasteTransform(transform) {
  transforms.push(transform);
  transforms.sort((a, b) => a.order - b.order);
}

export function runPasteTransforms(ctx) {
  for (const t of transforms) {
    try { t.run(ctx); } catch (err) { console.error(`[paste] transform "${t.name}" failed`, err); }
  }
  return ctx;
}
