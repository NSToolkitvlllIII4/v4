import { UNLIMITED_SELECTOR } from '../config/limits.js';

// Shared helpers for features that guard text people type or paste.
// "Text target" = anything a person can type words into:
//   native fields (text-like inputs, textareas) and editable hosts (Quill, contenteditable).
const TEXT_INPUT_TYPES = new Set(['text', 'search', 'url', 'tel']);

export const isNativeTextField = (el) =>
  !!el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && TEXT_INPUT_TYPES.has(el.type)));

export const isEditableHost = (el) =>
  !!el && !!(el.isContentEditable || el.closest?.('[contenteditable]:not([contenteditable="false"])'));

export const isTextTarget = (el) => isNativeTextField(el) || isEditableHost(el);

export const hasBrackets = (s) => /[<>]/.test(s);
export const stripBrackets = (s) => s.replace(/[<>]/g, '');

// ---- length helpers ----

// Is this field subject to the character limit?
export const isLimited = (el) => !el.closest?.(UNLIMITED_SELECTOR);

// Characters currently in the field (Quill adds a trailing newline, which does not count).
export const textLength = (el) =>
  isNativeTextField(el) ? el.value.length : el.textContent.replace(/\n$/, '').length;

// Characters the person has selected (typing would replace them).
export function selectedLength(el) {
  if (isNativeTextField(el)) return Math.max(0, (el.selectionEnd ?? 0) - (el.selectionStart ?? 0));
  const sel = window.getSelection?.();
  return sel && sel.rangeCount && el.contains(sel.anchorNode) ? sel.toString().length : 0;
}

// Cut text to at most `max` characters without splitting an emoji (surrogate pair) in half.
export function fitToLength(text, max) {
  if (text.length <= max) return text;
  let end = max;
  const last = text.charCodeAt(end - 1);
  if (last >= 0xD800 && last <= 0xDBFF) end -= 1;
  return text.slice(0, end);
}
