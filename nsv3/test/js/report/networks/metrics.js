// Which counts a network (or kind of "other" account) has, and how they read in a sentence. Pure.
import { getOtherType } from '../../config/other-types.js';
import { getCatalogMetric } from '../../config/metric-catalog.js';
import { escapeHtml } from '../helpers/text.js';
import { formatMetric } from '../helpers/grammar.js';

export function metricDefs(net, data) {
  if (net.id === 'other') return getOtherType(data.subType)?.metrics ?? [];
  return net.config?.metrics ?? [];
}

// ["5 posts", "1 follower"] for the counts that are switched on, then any the person added with "+ Add metric"
export function metricItems(net, data, { proSubj, isMale }) {
  const defs = metricDefs(net, data);
  const items = defs
    .filter((m) => data.metrics[m.k]?.on)
    .map((m) => {
      const val = data.metrics[m.k].val;
      if (net.id === 'other' && data.subType === 'myspace') {
        const shown = escapeHtml(val || '#');
        return m.k === 'connectedTo'
          ? `${shown} people ${proSubj}’s connected to`
          : `${shown} people connected to ${isMale ? 'him' : 'her'}`;
      }
      return formatMetric(val, m.l, m.forms);
    });

  if (net.id === 'other') {
    for (const extra of data.extraMetrics ?? []) {
      const metric = getCatalogMetric(extra.key);
      if (!metric || defs.some((m) => m.k === extra.key)) continue; // unknown, or this kind already has it
      items.push(formatMetric(extra.val, metric.ui, metric));
    }
  }
  return items;
}
