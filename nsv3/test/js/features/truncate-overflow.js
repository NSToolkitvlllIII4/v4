// Safety net: trims a native field back to the limit when text gets past limit-typing
// (autofill, voice, IME composition, pasted text, browser extensions).
// Keeps the caret in place and never splits an emoji in half.
import { MAX_LENGTH } from '../config/limits.js';
import { isNativeTextField, isLimited, fitToLength } from '../lib/text-fields.js';

export const name = 'truncate-overflow';

function trim(el, { notify = false } = {}) {
  if (!isNativeTextField(el) || !isLimited(el) || el.value.length <= MAX_LENGTH) return;

  const caret = el.selectionStart;
  el.value = fitToLength(el.value, MAX_LENGTH);
  if (caret != null) {
    const pos = Math.min(caret, el.value.length);
    try { el.setSelectionRange(pos, pos); } catch { /* no selection support */ }
  }
  if (notify) el.dispatchEvent(new Event('input', { bubbles: true })); // tell x-model
}

export function register() {
  // Capture phase on document runs before x-model reads the field.
  document.addEventListener('input', (e) => { if (!e.isComposing) trim(e.target); }, true);
  document.addEventListener('compositionend', (e) => trim(e.target, { notify: true }), true);
}
