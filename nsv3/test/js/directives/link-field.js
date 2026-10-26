// x-link-field="path.to.html": a one-line rich field where pasted links stay clickable (Quill).
// Reads and writes the HTML at that path. Placeholder comes from data-placeholder.
// x-link-field.raw keeps the editor's HTML exactly as is (the search-engine list needs its separators).
// Needs js/vendor/quill.min.js (loaded as a classic script in index.html).
export const name = 'link-field';

export function register(Alpine) {
  Alpine.directive('link-field', (el, { expression, modifiers }, { evaluateLater, effect }) => {
    if (!window.Quill) { console.error('[link-field] Quill is not loaded'); return; }

    const quill = new window.Quill(el, {
      theme: 'snow',
      formats: ['link'],
      bounds: document.body,
      modules: {
        history: { delay: 500, maxStack: 100, userOnly: true },
        toolbar: false,
        keyboard: { bindings: { enter: { key: 13, handler: () => false } } }, // single line
      },
      placeholder: el.dataset.placeholder ?? '',
    });

    const read = evaluateLater(expression);
    const write = evaluateLater(`${expression} = __html`);
    // The field stores plain HTML: paragraphs and line breaks removed, links kept.
    const raw = modifiers.includes('raw');
    const clean = () => (raw ? quill.root.innerHTML : quill.root.innerHTML.replace(/<\/?p[^>]*>/g, ' ').replace(/<br\s*\/?>/g, '').trim());

    let last = '';
    quill.on('text-change', () => {
      last = clean();
      write(() => {}, { scope: { __html: last } });
    });

    // Follows outside changes too (for example Discard all).
    effect(() => read((value) => {
      const next = value ?? '';
      if (next !== last) { last = next; quill.root.innerHTML = next; }
    }));
  });
}
