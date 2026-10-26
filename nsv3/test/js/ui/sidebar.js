// Renders the network list. Behavior lives in features, not here:
// this file only announces what the person did.
import { networks } from '../config/networks.js';

export function mountSidebar({ bus, store }) {
  const list = document.getElementById('network-list');

  networks.forEach((net) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label class="net">
        <input class="net__input" type="checkbox" data-net="${net.id}">
        <span class="net__tile" aria-hidden="true">${net.short}</span>
        <span class="net__name rail__label">${net.name}</span>
        <span class="net__switch" aria-hidden="true"></span>
      </label>`;
    list.append(li);
  });

  list.addEventListener('change', (e) => {
    const input = e.target.closest('.net__input');
    if (!input) return;
    const id = input.dataset.net;
    const checked = input.checked;
    const current = store.get('checkedNetworks');
    store.set({ checkedNetworks: checked ? [...current, id] : current.filter((n) => n !== id) });
    bus.emit('network:toggle', { id, checked });
  });
}
