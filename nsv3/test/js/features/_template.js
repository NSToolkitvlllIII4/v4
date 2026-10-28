// Template for a new feature. Keep one behavior (or one edge case) per file.
export const name = 'example-feature';

export function register(Alpine) {
  // A component, used in markup as  x-data="exampleFeature":
  Alpine.data('exampleFeature', () => ({
    count: 0,
    increment() { this.count++; },
  }));

  // Shared state, read anywhere as $store.example:
  // Alpine.store('example', { value: '' });

  // React to the sidebar or accordion:
  // window.addEventListener('network:toggle', (e) => { const { id, checked } = e.detail; });
  // window.addEventListener('section:open',   (e) => { const { id } = e.detail; });

  // Show something in the report pane (sanitized automatically when rendered):
  // Alpine.store('report').html = '<p>...</p>';

  // Need clean HTML elsewhere (e.g. copy to clipboard)?
  // import { sanitize } from '../lib/sanitize.js';
}
