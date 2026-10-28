// Which counts a network (or kind of "other" account) has, and how they read in a sentence. Pure.
import { getOtherType } from '../../config/other-types.js';
import { getCatalogMetric } from '../../config/metric-catalog.js';
import { escapeHtml } from '../helpers/text.js';
import { formatMetric } from '../helpers/grammar.js';

export function metricDefs(net, data) {
  if (net.id === 'other') return getOtherType(data.subType)?.metrics ?? [];
  return net.config?.metrics ?? [];
}

// One of a kind's own counts as a phrase: "5 posts", "1 follower"
function ownItem(net, data, m, val, { proSubj, isMale }) {
  if (net.id === 'other' && data.subType === 'myspace') {
    const shown = escapeHtml(val || '#');
    return m.k === 'connectedTo'
      ? `${shown} people ${proSubj}’s connected to`
      : `${shown} people connected to ${isMale ? 'him' : 'her'}`;
  }
  return formatMetric(val, m.l, m.forms);
}

// ["5 posts", "1 follower"] for the counts that are switched on, then any the person added with "+ Add metric"
// (Others: a count removed with the X is left out, and when added back it comes after the others.)
export function metricItems(net, data, who) {
  const defs = metricDefs(net, data);
  const hidden = data.hiddenMetrics ?? [];
  const shown = defs.filter((m) => !hidden.includes(m.k));
  const items = shown
    .filter((m) => data.metrics[m.k]?.on)
    .map((m) => ownItem(net, data, m, data.metrics[m.k].val, who));

  if (net.id === 'other') {
    for (const extra of data.extraMetrics ?? []) {
      if (shown.some((m) => m.k === extra.key)) continue;            // this kind already shows it
      const own = defs.find((m) => m.k === extra.key);                // one of this kind's counts that was removed and added back
      if (own) { items.push(ownItem(net, data, own, extra.val, who)); continue; }
      const metric = getCatalogMetric(extra.key);
      if (!metric) continue;                                          // unknown
      items.push(formatMetric(extra.val, metric.ui, metric));
    }
  }
  return items;
}
