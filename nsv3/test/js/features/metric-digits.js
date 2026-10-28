// Metric fields ([data-metric]) can't contain "-": counts are never negative.
// Runs before x-model reads the field, and keeps the caret where it was.
export const name = 'metric-digits';

export function register() {
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.matches?.('[data-metric]') || !el.value.includes('-')) return;
    const caret = el.selectionStart;
    const keep = caret == null ? null : el.value.slice(0, caret).replace(/-/g, '').length;
    el.value = el.value.replace(/-/g, '');
    if (keep != null) {
      try { el.setSelectionRange(keep, keep); } catch { /* no selection support */ }
    }
  }, true);
}
