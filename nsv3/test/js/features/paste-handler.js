// Takes over pasting into any text field (native, Quill, contenteditable):
// reads the clipboard, runs the paste transforms, then inserts the result as clean text
// cut to the room left, or as rich HTML when a transform asks for it.
// Undo keeps working because the insert goes through the browser's own editing command.
import { MAX_LENGTH } from '../config/limits.js';
import {
  isTextTarget, isNativeTextField, isLimited, textLength, selectedLength, fitToLength,
} from '../lib/text-fields.js';
import { runPasteTransforms } from '../lib/paste-pipeline.js';

export const name = 'paste-handler';

const kindOf = (el) => (el.closest?.('.ql-editor') ? 'quill' : isNativeTextField(el) ? 'native' : 'editable');
const hostOf = (el, kind) =>
  kind === 'native' ? el : (el.closest('.ql-editor') ?? el.closest('[contenteditable]') ?? el);

function insertInto(ctx, command, value) {
  if (document.execCommand?.(command, false, value)) return;
  // Fallback for browsers without the editing command: native fields only.
  if (ctx.kind === 'native' && command === 'insertText') {
    const el = ctx.target;
    el.setRangeText(value, el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: value }));
  }
}

export function register() {
  document.addEventListener('paste', (e) => {
    const target = e.target;
    if (!isTextTarget(target) || !e.clipboardData) return;

    // Stop the browser (and Quill) from pasting on their own.
    e.preventDefault();
    e.stopImmediatePropagation();

    const kind = kindOf(target);
    const ctx = {
      target,
      kind,
      host: hostOf(target, kind),
      isLink: !!target.matches?.('[data-type="hyperlink"]'),
      text: e.clipboardData.getData('text/plain'),
      html: e.clipboardData.getData('text/html'),
      insertHtml: null,
    };
    runPasteTransforms(ctx);

    if (ctx.insertHtml) return insertInto(ctx, 'insertHTML', ctx.insertHtml);

    let text = ctx.text ?? '';
    if (isLimited(ctx.host)) {
      // Selected text gets replaced, so it frees up room.
      const room = MAX_LENGTH - (textLength(ctx.host) - selectedLength(ctx.host));
      if (room <= 0) return;
      text = fitToLength(text, room);
    }
    if (text) insertInto(ctx, 'insertText', text);
  }, true);
}
