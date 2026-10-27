// Enforces the character limit (config/limits.js) while people type or drop text.
// Works in native fields, Quill and contenteditable. Fields matching UNLIMITED_SELECTOR are skipped.
// Pasting is handled by the paste feature; anything that slips past is trimmed by truncate-overflow.js.
import { MAX_LENGTH } from '../config/limits.js';
import { isTextTarget, isLimited, textLength, selectedLength } from '../lib/text-fields.js';

export const name = 'limit-typing';

const TEXT_INPUTS = new Set(['insertText', 'insertReplacementText', 'insertFromDrop']);
const LINE_BREAKS = new Set(['insertLineBreak', 'insertParagraph']); // a new line counts as 1 character

export function register() {
  document.addEventListener('beforeinput', (e) => {
    const el = e.target;
    if (!isTextTarget(el) || !isLimited(el)) return;

    let incoming;
    if (TEXT_INPUTS.has(e.inputType)) incoming = (e.data ?? e.dataTransfer?.getData('text/plain') ?? '').length;
    else if (LINE_BREAKS.has(e.inputType)) incoming = 1;
    else return;

    // Selected text is replaced, so it frees up room.
    if (textLength(el) - selectedLength(el) + incoming > MAX_LENGTH) e.preventDefault();
  }, true);
}
