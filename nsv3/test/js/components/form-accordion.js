// Accordion: one section open at a time, driven by $store.app.activeSection.
// The sections themselves are built by core/form-builder.js before Alpine starts.
export const name = 'form-accordion';

export function register(Alpine) {
  Alpine.data('formAccordion', () => ({
    isOpen(id) {
      return Alpine.store('app').activeSection === id;
    },

    onToggle(id, event) {
      const app = Alpine.store('app');
      if (event.target.open) {
        app.activeSection = id;
        this.$dispatch('section:open', { id });
      } else if (app.activeSection === id) {
        app.activeSection = '';
      }
    },
  }));
}
