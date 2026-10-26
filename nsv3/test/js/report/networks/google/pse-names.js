// The search engine(s) typed into the link field -> a readable list.
// "Mylife", "Mylife and Radaris", "Mylife, Radaris, and Bing". Blank -> "(public search engine)".
import { joinList } from '../../helpers/text.js';

const FALLBACK = '(public search engine)';

export function pseNames(raw) {
  const cleaned = (raw || '')
    .replace(/<\/a>\s*<a/gi, '</a>|||<a')       // side-by-side links are separate engines
    .replace(/<\/p>\s*<p[^>]*>/gi, '|||')
    .replace(/<br\s*\/?>/gi, '|||')
    .replace(/<\/?p[^>]*>/gi, '')
    .trim();
  if (!cleaned) return FALLBACK;
  const items = cleaned.split('|||').map((s) => s.trim()).filter(Boolean);
  return items.length ? joinList(items) : FALLBACK;
}

// Just the words, no links: used to spot the one engine that gets its own wording (Google)
export const pseText = (raw) => (raw || '').replace(/<[^>]*>?/gm, '').trim();
