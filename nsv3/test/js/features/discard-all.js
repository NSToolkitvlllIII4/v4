// "Discard all" button: puts the whole form back to a clean state.
//  - If anything holds real text (more than spaces), an Ease App alert window asks first (the <dialog class="modal"> in index.html).
//  - If nothing does (empty fields, extra empty accounts/clones, empty rows), it clears straight away without asking.
// Only typed text counts as "filled"; switches, choices and the number of empty accounts do not.
// The button starts disabled in index.html and is switched on here, so if this file ever fails to load
// the button stays disabled instead of silently doing nothing.
export const name = 'discard-all';

const FEEDBACK_MS = 2000;

// Fields that hold a choice rather than typed text (their value is never "empty"), and ids/keys.
const SKIP = new Set([
  'id', 'key', 'type', 'subType', 'matchStatus', 'accountType', 'mentionMedia', 'activity',
  'finding', 'resultType', 'reportType', 'subjectGender', 'scope', 'hiddenMetrics',
]);

// Visible text of a field: tags removed (fields can hold HTML), non-breaking and zero-width spaces treated as spaces.
const visibleText = (value) => {
  const text = value.includes('<') || value.includes('&')
    ? (new DOMParser().parseFromString(value, 'text/html').body.textContent ?? '')
    : value;
  return text.replace(/[\s\u00a0\u200b-\u200d\ufeff]+/g, '');
};

// True when any text field inside `node` holds something other than spaces.
function hasText(node) {
  if (typeof node === 'string') return visibleText(node) !== '';
  if (Array.isArray(node)) return node.some(hasText);
  if (node && typeof node === 'object') {
    return Object.keys(node).some((k) => !SKIP.has(k) && hasText(node[k]));
  }
  return false;
}

export function register(Alpine) {
  const button = document.querySelector('[data-action="discard"]');
  const dialog = document.getElementById('discard-dialog');
  if (!button || !dialog) return;

  const confirmBtn = dialog.querySelector('[data-modal="confirm"]');
  const cancelBtn = dialog.querySelector('[data-modal="cancel"]');
  const status = document.getElementById('report-status'); // screen-reader announcement
  const label = button.textContent;
  let timer;

  // The form store's only typed text is in `relatives`; the rest of it is choices. Everything else is in the networks store.
  const isFilled = () => hasText(Alpine.store('form').relatives) || hasText(Alpine.store('networks').byId);

  const clearAll = () => {
    Alpine.store('form').reset();
    Alpine.store('networks').reset();
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
