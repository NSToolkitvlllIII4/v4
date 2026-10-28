// Puts the network paragraphs in the order set by config/hierarchy.js.
import { TIERS, KIND_TIERS, SLOTS } from '../config/hierarchy.js';

// Which tier a paragraph belongs to: its own kind (page or website), otherwise the tier of its network.
export function tierFor(netId, accountType) {
  if (KIND_TIERS.includes(accountType)) return accountType;
  if (netId === 'goog') return 'google';
  if (netId === 'other') return 'other';
  return 'social';
}

// entries: [{ html, owner, tier, slot }]. Stable, so paragraphs that tie keep the order they were written in.
export function orderEntries(entries) {
  const rank = (e) => TIERS.indexOf(e.tier) * SLOTS.length + SLOTS.indexOf(e.slot ?? 'matched');
  return entries
    .map((e, i) => ({ e, i, r: rank(e) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map(({ e }) => e);
}
