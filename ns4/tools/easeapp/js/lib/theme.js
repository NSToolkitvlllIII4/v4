// Light / dark theme. The choice is remembered in localStorage and written as the class "theme-light" on <html>
// (nothing = dark, the default). js/theme-boot.js sets the class before first paint (same key); keep the two in sync.
export const KEY = 'ease:theme';
export const CLASS = 'theme-light';

export function readTheme() {
  try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}
export function saveTheme(theme) {
  try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ }
}
export function applyTheme(theme) {
  document.documentElement.classList.toggle(CLASS, theme === 'light');
}
