// Warns before the page is refreshed, closed or left while any field holds text (more than spaces).
// Uses the browser's own "Leave site?" prompt: browsers do not allow a page to restyle it or change its wording.
// Nothing is shown when the form is empty, or right after "Discard all".
import { isFormFilled } from '../lib/filled-check.js';

export const name = 'leave-warning';

export function register(Alpine) {
  window.addEventListener('beforeunload', (e) => {
    if (!isFormFilled(Alpine)) return;
    e.preventDefault();
    e.returnValue = ''; // required by older browsers to show the prompt
  });
}
