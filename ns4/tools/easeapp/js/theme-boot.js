// Sets the light theme class before the page is first drawn, so a saved light theme does not flash dark on load.
// Plain script, not a module. The key and class match js/lib/theme.js. The default (nothing saved) is dark.
try {
  if (localStorage.getItem('ease:theme') === 'light') document.documentElement.classList.add('theme-light');
} catch { /* storage unavailable */ }
