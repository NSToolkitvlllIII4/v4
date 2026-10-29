// Sets the locked-sidebar class before the page is first drawn, so a locked sidebar does not flash narrow on load.
// Plain script, not a module. The key and class match js/lib/rail-lock.js.
try {
  if (localStorage.getItem('ease:rail-locked') === '1') document.documentElement.classList.add('rail-locked');
} catch { /* storage unavailable */ }
