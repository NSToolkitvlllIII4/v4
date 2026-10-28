// App-wide state: read with Alpine.store('app') or $store.app in markup.
import { CLASS, readLocked, saveLocked } from '../lib/rail-lock.js';

export const name = 'app-store';

export function register(Alpine) {
  Alpine.store('app', {
    activeSection: 'nullset',

    // Sidebar lock: true = the sidebar stays open and sits beside the form and report (remembered between visits)
    railLocked: readLocked(),

    toggleRailLock() {
      this.railLocked = !this.railLocked;
      document.documentElement.classList.toggle(CLASS, this.railLocked);
      saveLocked(this.railLocked);
      window.dispatchEvent(new CustomEvent('rail:lock', { detail: { locked: this.railLocked } }));
    },
  });
}
