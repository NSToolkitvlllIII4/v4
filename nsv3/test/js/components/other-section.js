// Logic for the "Other social medias" section (partials/other.html).
// Shows the active account of that network; which fields appear depends on its kind.
import { getOtherType } from '../config/other-types.js';
import { metricCatalog, getCatalogMetric } from '../config/metric-catalog.js';
import { uid } from '../lib/uid.js';
import { newFinding } from '../stores/form.js';

export const name = 'other-section';

export function register(Alpine) {
  Alpine.data('otherSection', () => ({
    get state() { return Alpine.store('networks').byId.other; },
    get d() { return this.state.instances[this.state.activeClone] ?? this.state.instances[0]; },
    get kind() { return getOtherType(this.d.subType); },

    get isPlus() { return Alpine.store('form').reportType === 'plus'; },
    get hasAccount() { return ['personal', 'personal-page', 'business'].includes(this.d.accountType); },

    get isNamed() { return !!this.kind?.named; },                       // General, E-commerce: type the site's name
    get metricRows() { return this.kind?.metrics ?? []; },              // the counts this kind has
    get hasLocation() { return ['general', 'ecommerce', 'myspace', 'zoominfo'].includes(this.d.subType); },
    get hasStatus() { return ['general', 'ecommerce'].includes(this.d.subType); },
    get hasActivityAction() { return this.d.subType === 'general'; },

    // ---- counts added with "+ Add metric" (on top of the kind's own counts)
    menuOpen: false,
    get defaultKeys() { return this.metricRows.map((m) => m.k); },
    // Added counts that apply to this kind (one it already has is skipped, so nothing shows twice)
    get extras() { return this.d.extraMetrics.filter((e) => !this.defaultKeys.includes(e.key)); },
    // What can still be added: the catalog, minus what is already here
    get available() {
      const used = new Set([...this.defaultKeys, ...this.extras.map((e) => e.key)]);
      return metricCatalog.filter((m) => !used.has(m.k));
    },
    metricLabel(key) { return getCatalogMetric(key)?.ui ?? key; },
    addMetric(key) { this.d.extraMetrics.push({ id: uid(), key, val: '' }); this.menuOpen = false; },
    removeMetric(id) {
      const i = this.d.extraMetrics.findIndex((e) => e.id === id);
      if (i !== -1) this.d.extraMetrics.splice(i, 1);
    },

    addFinding() { this.d.progFindings.push(newFinding()); },
    removeFinding(index) { if (this.d.progFindings.length > 1) this.d.progFindings.splice(index, 1); },
  }));
}
