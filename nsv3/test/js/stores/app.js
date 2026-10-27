// App-wide state: read with Alpine.store('app') or $store.app in markup.
export const name = 'app-store';

export function register(Alpine) {
  Alpine.store('app', {
    activeSection: 'nullset',
  });
}
