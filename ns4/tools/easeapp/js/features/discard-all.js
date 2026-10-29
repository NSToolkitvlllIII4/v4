// "Discard all" button: puts the whole form back to a clean state.
//  - If anything holds real text (more than spaces), an Ease App alert window asks first (the <dialog class="modal"> in index.html).
//  - If nothing does (empty fields, extra empty accounts/clones, empty rows), it clears straight away without asking.
// Only typed text counts as "filled"; switches, choices and the number of empty accounts do not.
// The button starts disabled in index.html and is switched on here, so if this file ever fails to load
// the button stays disabled instead of silently doing nothing.
import { isFormFilled } from '../lib/filled-check.js';
import { clearBackup } from '../lib/session-backup.js';

export const name = 'discard-all';

const FEEDBACK_MS = 2000;

export function register(Alpine) {
  const button = document.querySelector('[data-action="discard"]');
  const dialog = document.getElementById('discard-dialog');
  if (!button || !dialog) return;

  const confirmBtn = dialog.querySelector('[data-modal="confirm"]');
  const cancelBtn = dialog.querySelector('[data-modal="cancel"]');
  const status = document.getElementById('report-status'); // screen-reader announcement
  const label = button.textContent;
  let timer;

  const isFilled = () => isFormFilled(Alpine); // shared rule: js/lib/filled-check.js

  const clearAll = () => {
    Alpine.store('form').reset();
    Alpine.store('networks').reset();
    clearBackup(); // also deletes the saved session (features/restore-session.js)
    Alpine.store('app').activeSection = 'nullset';

    clearTimeout(timer);
    button.textContent = '✓ Cleared';
    button.classList.add('is-copied');
    if (status) status.textContent = 'Everything was cleared';
    timer = setTimeout(() => {
      button.textContent = label;
      button.classList.remove('is-copied');
      if (status) status.textContent = '';
    }, FEEDBACK_MS);
  };

  button.disabled = false;
  button.addEventListener('click', () => {
    if (!isFilled()) return clearAll();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else if (window.confirm('Discard everything you entered? This cannot be undone.')) clearAll(); // very old browsers only
  });

  cancelBtn?.addEventListener('click', () => dialog.close());
  confirmBtn?.addEventListener('click', () => { dialog.close(); clearAll(); });
  // Clicking the dimmed area outside the window cancels
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}
