// "Copy report" button: copies the report as rich text (for email, Word, tickets) plus a plain-text version.
// The button starts disabled in index.html and is switched on here, so if this file ever fails to load
// the button stays disabled instead of silently doing nothing.
import { clipboardHtml } from '../report/clipboard.js';
import { sanitize } from '../lib/sanitize.js';
import { htmlToText } from '../lib/html-text.js';
import { writeClipboard } from '../lib/clipboard.js';

export const name = 'copy-report';

const FEEDBACK_MS = 2000;

export function register(Alpine) {
  const button = document.querySelector('[data-action="copy"]');
  if (!button) return;

  const status = document.getElementById('report-status'); // screen-reader announcement
  const label = button.textContent;
  let timer;

  const flash = (text, cls) => {
    clearTimeout(timer);
    button.textContent = text;
    button.classList.remove('is-copied', 'is-failed');
    button.classList.add(cls);
    if (status) status.textContent = text;
    timer = setTimeout(() => {
      button.textContent = label;
      button.classList.remove(cls);
      if (status) status.textContent = '';
    }, FEEDBACK_MS);
  };

  button.disabled = false;
  button.addEventListener('click', async () => {
    const paragraphs = Alpine.store('report').paragraphs;
    if (!paragraphs.length) return;

    const html = sanitize(clipboardHtml(paragraphs));
    // Plain text comes from the sanitized paragraphs too, so removed content (like scripts) can't leak in.
    const text = paragraphs.map((p) => htmlToText(sanitize(p))).join('\n\n'); // blank line between bullets
    const ok = await writeClipboard({ html, text });

    if (ok) flash('✓ Copied', 'is-copied');
    else flash('Couldn’t copy', 'is-failed');
  });
}
