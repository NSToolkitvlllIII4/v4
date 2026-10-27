// Draggable divider between the form and the report.
// Drag it, or focus it and use the arrow keys (Shift = bigger steps, Home/End = limits).
// Double-click resets. The size is remembered between visits.
// Minimum sizes come from --min-form and --min-report in css/base.css.
const KEY = 'ease:form-width';
const DEFAULT = 60; // percent of the workspace the form starts with

const readSaved = () => {
  try {
    const n = parseFloat(localStorage.getItem(KEY));
    return Number.isFinite(n) && n > 0 && n < 100 ? n : null;
  } catch { return null; }
};
const save = (n) => { try { localStorage.setItem(KEY, String(n)); } catch { /* storage unavailable */ } };

export const name = 'splitter';

export function register(Alpine) {
  Alpine.data('splitter', () => ({
    percent: DEFAULT, // what the person chose
    min: 0,           // limits in percent, derived from the minimum pixel sizes
    max: 100,
    dragging: false,

    init() {
      this.sync();
      this.set(readSaved() ?? DEFAULT);
      window.addEventListener('resize', () => this.sync());
    },

    // Percent of the workspace the form may take, given the pixel minimums.
    sync() {
      const total = this.$root.getBoundingClientRect().width;
      if (!total) return;
      const css = getComputedStyle(this.$root);
      const px = (v) => parseFloat(css.getPropertyValue(v)) || 0;
      this.min = (px('--min-form') / total) * 100;
      this.max = Math.max(this.min, ((total - px('--min-report') - px('--handle-w')) / total) * 100);
    },

    set(pct) {
      this.sync();
      this.percent = Math.round(Math.min(Math.max(pct, this.min), this.max) * 10) / 10;
      this.$root.style.setProperty('--form-w', this.percent + '%');
    },

    // What is shown to assistive tech (the limits can change when the window resizes).
    get shown() { return Math.round(Math.min(Math.max(this.percent, this.min), this.max)); },

    start(e) {
      if (e.button) return; // left button / touch / pen only
      e.currentTarget.setPointerCapture(e.pointerId);
      this.dragging = true;
      document.body.classList.add('is-resizing');
    },

    move(e) {
      if (!this.dragging) return;
      const rect = this.$root.getBoundingClientRect();
      const handle = parseFloat(getComputedStyle(this.$root).getPropertyValue('--handle-w')) || 0;
      // Keep the divider centered under the pointer.
      this.set(((e.clientX - rect.left - handle / 2) / rect.width) * 100);
    },

    end(e) {
      if (!this.dragging) return;
      this.dragging = false;
      document.body.classList.remove('is-resizing');
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      save(this.percent);
    },

    key(e) {
      const step = e.shiftKey ? 10 : 2;
      let next;
      if (e.key === 'ArrowLeft') next = this.percent - step;
      else if (e.key === 'ArrowRight') next = this.percent + step;
      else if (e.key === 'Home') next = this.min;
      else if (e.key === 'End') next = this.max;
      else return;
      e.preventDefault();
      this.set(next);
      save(this.percent);
    },

    reset() {
      this.set(DEFAULT);
      save(this.percent);
    },
  }));
}
