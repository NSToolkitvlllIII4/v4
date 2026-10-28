// Stops "<" and ">" from being typed into any text field (native, Quill, contenteditable).
// Paste is handled by its own feature; the safety net for everything else is strip-angle-brackets.js.
import { isTextTarget, hasBrackets } from '../lib/text-fields.js';

export const name = 'block-angle-brackets';

// Insertions that come from typing, suggestions or dropping text. (Paste is not listed on purpose.)
const BLOCKED_INPUT_TYPES = new Set(['insertText', 'insertReplacementText', 'insertFromDrop']);

export function register() {
  // Desktop keyboards: block the key before anything else (including Quill) sees it.
  document.addEventListener('keydown', (e) => {
    if ((e.key === '<' || e.key === '>') && isTextTarget(e.target)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // Mobile keyboards often report the key as "Unidentified", so also check the text being inserted.
  document.addEventListener('beforeinput', (e) => {
    if (!isTextTarget(e.target) || !BLOCKED_INPUT_TYPES.has(e.inputType)) return;
    const text = e.data ?? e.dataTransfer?.getData('text/plain') ?? '';
    if (hasBrackets(text)) e.preventDefault();
  }, true);
}
