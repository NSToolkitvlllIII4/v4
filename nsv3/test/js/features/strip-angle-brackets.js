// Safety net: removes "<" and ">" that still get into a native field
// (autofill, voice input, IME composition, dropped or pasted text, browser extensions).
// Keeps the caret where it was. Quill and contenteditable are handled by the paste feature
// and by DOMPurify when the report is rendered.
import { isNativeTextField, hasBrackets, stripBrackets } from '../lib/text-fields.js';

export const name = 'strip-angle-brackets';

function clean(el, { notify = false } = {}) {
  if (!isNativeTextField(el) || !hasBrackets(el.value)) return;

  const caret = el.selectionStart;
  const keep = caret == null ? null : stripBrackets(el.value.slice(0, caret)).length;
  el.value = stripBrackets(el.value);
  if (keep != null) {
    try { el.setSelectionRange(keep, keep); } catch { /* field type has no selection */ }
  }
  // Outside an input event nothing else knows the value changed, so tell x-model.
  if (notify) el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function register() {
  // Capture phase on document runs before x-model reads the field, so state never sees the symbols.
  document.addEventListener('input', (e) => {
    if (!e.isComposing) clean(e.target);
  }, true);

  // Wait for IME composition to finish before cleaning.
  document.addEventListener('compositionend', (e) => clean(e.target, { notify: true }), true);
}
