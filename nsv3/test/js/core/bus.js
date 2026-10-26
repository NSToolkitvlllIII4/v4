// Minimal event bus. Modules talk through events instead of importing each other.
// Example: bus.emit('network:toggle', { id: 'fb', checked: true })
const listeners = new Map();

export const bus = {
  on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => listeners.get(event).delete(fn); // call to unsubscribe
  },
  emit(event, payload) {
    (listeners.get(event) || []).forEach((fn) => {
      try { fn(payload); } catch (err) { console.error(`[bus] "${event}" handler failed`, err); }
    });
  },
};
