// Renders the empty accordion. Fields are added later by features.
import { sections } from '../config/sections.js';

export function mountForm({ bus, store }) {
  const root = document.getElementById('form-sections');

  sections.forEach((s) => {
    const el = document.createElement('details');
    el.className = 'section';
    el.id = `section-${s.id}`;
    el.open = store.get('activeSection') === s.id;
    el.innerHTML = `
      <summary class="section__summary">${s.title}</summary>
      <div class="section__body" data-section-body="${s.id}">
        <p class="empty">No fields yet.</p>
      </div>`;
    root.append(el);
  });

  // One section open at a time, like the original.
  root.addEventListener('toggle', (e) => {
    const el = e.target;
    if (!el.open) return;
    root.querySelectorAll('details.section[open]').forEach((d) => { if (d !== el) d.open = false; });
    const id = el.id.replace('section-', '');
    store.set({ activeSection: id });
    bus.emit('section:open', { id });
  }, true);
}
