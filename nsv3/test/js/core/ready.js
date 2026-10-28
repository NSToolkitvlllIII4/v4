// Ends the startup skeleton: the real form and report replace it (css/skeleton.css).
export function markReady() {
  document.body.classList.remove('is-loading');
  document.body.classList.add('is-ready');
  document.body.removeAttribute('aria-busy');
}
