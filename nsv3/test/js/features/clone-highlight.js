// Blinks to show where a new account (clone) went.
//  - Rail open (it normally is when "+" is clicked): the new row in the sidebar list blinks.
//  - When the rail closes afterwards, the network's form header blinks, because the form is only
//    visible again from that moment (it is blurred and dimmed while the rail is open).
//  - Rail already closed (e.g. a keyboard shortcut later): the network tile and the form header blink right away.
// Plus mode only: each time the header blinks, a small arrow on the divider (the splitter) blinks too, level with the
// report bullet written from the new account, so the eye lands on the right bullet. The report scrolls to that bullet
// first if it is out of view. Progressive reports have no such bullets, so nothing shows there.
// A locked sidebar (see lib/rail-lock.js) never covers the form, so it counts as closed: blinks go to the tile and header at once.
// The rail's state is also written to  data-open="true|false"  on .rail, so other code can read it.
import { lockApplies } from '../lib/rail-lock.js';

export const name = 'clone-highlight';

const PING = 'is-ping';
const HEADER_DELAY = 180; // ms: lets the blur fade out before the header blinks

// Restart the blink even if the element is already blinking
function ping(el) {
  if (!el) return;
  el.classList.remove(PING);
  void el.offsetWidth; // forces a reflow so the animation restarts
  el.classList.add(PING);
  el.addEventListener('animationend', () => el.classList.remove(PING), { once: true });
}

export function register(Alpine) {
  const rail = () => document.querySelector('.rail');
  let hover = false;
  let open = false;
  let pending = null; // { id, instance }: whose header (and bullet) should blink when the rail closes

  const header = (id) => document.querySelector(`#section-${id} > .section__summary`);

  // The divider's arrow, made on first use
  const marker = () => {
    const splitter = document.querySelector('.splitter');
    if (!splitter) return null;
    let el = splitter.querySelector('.splitter__marker');
    if (!el) {
      el = document.createElement('span');
      el.className = 'splitter__marker';
      el.setAttribute('aria-hidden', 'true');
      splitter.append(el);
    }
    return el;
  };

  // Blink the divider arrow level with the report bullet that belongs to this account
  const pingBullet = (instance) => {
    if (Alpine.store('form').reportType !== 'plus') return;
    const splitter = document.querySelector('.splitter');
    const sheet = document.getElementById('report-output');
    const bullet = sheet?.querySelector(`li[data-owners~="${instance}"]`);
    const arrow = marker();
    if (!splitter || !sheet || !bullet || !arrow || !splitter.offsetParent) return; // no bullet yet, or stacked layout (no divider)

    // Bring the bullet into view first (instant, so the arrow lines up with where it ends up)
    const view = sheet.getBoundingClientRect();
    const at = bullet.getBoundingClientRect();
    if (at.top < view.top || at.bottom > view.bottom) {
      sheet.scrollTop += at.top - view.top - sheet.clientHeight * 0.25;
    }
    // Level with the bullet dot: half of its first line (about 12px) below its top
    const top = bullet.getBoundingClientRect().top - splitter.getBoundingClientRect().top + 12;
    arrow.style.setProperty('--marker-y', `${Math.round(top)}px`);
    ping(arrow);
  };

  // Header and bullet blink together
  const pingHeaderAndBullet = ({ id, instance }) => {
    ping(header(id));
    pingBullet(instance);
  };

  const update = () => {
    const el = rail();
    if (!el) return;
    // Same two conditions as the CSS: mouse over the rail, or keyboard focus inside it
    // A locked sidebar sits beside the page instead of over it, so it never hides the form: it counts as closed
    const now = !lockApplies() && (hover || el.matches(':has(:focus-visible)'));
    if (now === open) return;
    open = now;
    el.dataset.open = String(open);
    if (!open && pending) {
      const target = pending;
      pending = null;
      setTimeout(() => pingHeaderAndBullet(target), HEADER_DELAY);
    }
  };

  const watch = () => {
    const el = rail();
    if (!el) return;
    el.dataset.open = 'false';
    el.addEventListener('mouseenter', () => { hover = true; update(); });
    el.addEventListener('mouseleave', () => { hover = false; update(); });
    // Focus moves between elements inside the rail, so check after the move has settled
    el.addEventListener('focusin', () => setTimeout(update, 0));
    el.addEventListener('focusout', () => setTimeout(update, 0));
    window.addEventListener('rail:lock', update);
    window.addEventListener('resize', update);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch, { once: true });
  else watch();

  window.addEventListener('clone:add', (e) => {
    const { id, instance } = e.detail;
    // Wait for Alpine to draw the new row, then a frame for layout
    Alpine.nextTick(() => requestAnimationFrame(() => {
      update();
      if (open) {
        ping(document.querySelector(`[data-clones="${id}"] > li:last-child`));
        pending = { id, instance };
      } else {
        ping(document.querySelector(`[data-net="${id}"] .net__tile`));
        pingHeaderAndBullet({ id, instance });
      }
    }));
  });
}
