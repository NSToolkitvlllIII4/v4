// Shared state. One file per store.
export default [
  () => import('./app.js'),
  () => import('./form.js'),
  () => import('./networks.js'),
  () => import('./report.js'),
];
