// Logic for the Relatives & associates section (partials/relatives.html).
import { newRow, newFinding } from '../stores/form.js';

export const name = 'relatives';

export function register(Alpine) {
  Alpine.data('relativesSection', () => ({
    get r() { return Alpine.store('form').relatives; },

    setFound(value) { this.r.found = value; },

    addRow() { this.r.rows.push(newRow()); },
    removeRow() { if (this.r.rows.length > 1) this.r.rows.pop(); }, // removes the most recent

    addFinding() { this.r.progFindings.push(newFinding()); },
    removeFinding(index) { if (this.r.progFindings.length > 1) this.r.progFindings.splice(index, 1); },
  }));
}
