// Crash recovery. While the form has anything worth keeping, a copy is saved to localStorage; on the next
// visit an Ease App alert window offers to restore it. "Discard all" deletes the copy.
// Rules (what counts, how it is saved and merged): js/lib/session-backup.js
//   - typing is saved shortly after you pause; switches, accounts, rows and metrics are saved at once
//   - the copy is also saved when the tab is hidden or closed
//   - saving only starts once you have answered the restore question, so a waiting copy is never overwritten
import {
  clearBackup, flushBackup, isWorthSaving, readBackup, restoreSnapshot, saveNow, saveSoon, structureOf, takeSnapshot,
} from '../lib/session-backup.js';

export const name = 'restore-session';

const ageText = (ms) => {
  const min = Math.round(ms / 60000);
  if (min < 1) return 'less than a minute ago';
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const h = Math.round(min / 60);
  return `${h} hour${h === 1 ? '' : 's'} ago`;
};

function startSaving(Alpine) {
  let lastStructure = null;
  // Runs again whenever anything in the form changes
  Alpine.effect(() => {
    const snap = takeSnapshot(Alpine);
    const structure = structureOf(snap);
    if (!isWorthSaving(snap)) clearBackup();
    else if (lastStructure !== null && structure !== lastStructure) saveNow(snap);
    else saveSoon(snap);
    lastStructure = structure;
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushBackup(); });
  window.addEventListener('pagehide', flushBackup);
}

export function register(Alpine) {
  // Wait until Alpine has built the page, so the restored data fills the fields
  document.addEventListener('alpine:initialized', () => {
    const backup = readBackup();
    const dialog = document.getElementById('restore-dialog');
    if (!backup || !dialog || typeof dialog.showModal !== 'function') return startSaving(Alpine);

    const age = document.getElementById('restore-age');
    if (age) age.textContent = ageText(Date.now() - backup.savedAt);

    // Must choose: Esc does not close it
    dialog.addEventListener('cancel', (e) => e.preventDefault());
    dialog.querySelector('[data-modal="restore"]')?.addEventListener('click', () => {
      dialog.close();
      restoreSnapshot(Alpine, backup.snapshot);
      startSaving(Alpine);
    });
    dialog.querySelector('[data-modal="fresh"]')?.addEventListener('click', () => {
      dialog.close();
      clearBackup();
      startSaving(Alpine);
    });
    dialog.showModal();
  }, { once: true });
}
