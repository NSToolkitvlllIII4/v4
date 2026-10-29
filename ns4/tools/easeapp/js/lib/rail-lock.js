// Locked sidebar: the rail stays fully open and the form and report share the rest of the width.
// The choice is remembered in localStorage and written as the class "rail-locked" on <html>.
// js/rail-lock-boot.js sets the class before first paint (same key); keep the two in sync.
export const KEY = 'ease:rail-locked';
export const CLASS = 'rail-locked';
export const MIN_WIDTH = 1000; // px. Below this there is no room for rail + form + report, so the lock is ignored (keep in sync with css/layout.css and css/sidebar.css)

export function readLocked() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
export function saveLocked(on) {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* storage unavailable */ }
}
// True when the lock is on and the window is wide enough for it to apply
export function lockApplies() {
  return document.documentElement.classList.contains(CLASS) && window.matchMedia(`(min-width: ${MIN_WIDTH}px)`).matches;
}
