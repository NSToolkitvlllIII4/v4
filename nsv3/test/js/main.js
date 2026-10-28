// Entry point. Registers every module with Alpine, then starts Alpine once.
// Alpine scans the page a single time on start, so everything must be registered first.
import Alpine from './vendor/alpine.esm.min.js';
import { loadModules } from './core/loader.js';
import { buildForm } from './core/form-builder.js';
import { markReady } from './core/ready.js';
import { sections } from './config/sections.js';
import magics from './magics/index.js';
import directives from './directives/index.js';
import components from './components/index.js';
import stores from './stores/index.js';
import features from './features/index.js';

window.Alpine = Alpine;

try {
  await loadModules(Alpine, [...directives, ...magics, ...stores, ...components, ...features]);
  await buildForm(document.getElementById('form-sections'), sections);
} finally {
  Alpine.start(); // always start, even if a feature failed to load
  // Two frames later, so Alpine's first render is on screen before the skeleton goes away
  requestAnimationFrame(() => requestAnimationFrame(markReady));
}
