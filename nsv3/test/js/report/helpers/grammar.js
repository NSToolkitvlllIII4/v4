// Small grammar helpers for report sentences. Pure.
import { escapeHtml } from './text.js';

// "a" or "an" (capitalized). Also "an" before 8 and X ("an 8th", "an X (Twitter)").
export const article = (text) => (/^[AEIOU8X]/i.test(String(text)) ? 'An' : 'A');

// 1st, 2nd, 3rd, 4th ... 11th, 12th, 13th ... 21st, 22nd
export function ordinal(n) {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] ?? 'th'}`;
}

// ("5", "Followers") -> "5 followers"; ("1", "Followers") -> "1 follower"; blank value -> "# followers"
export function formatMetric(val, label, forms) {
  const shown = escapeHtml(val || '#');
  const singular = ['1', 'one'].includes((val || '#').toString().trim().toLowerCase());
  if (forms) return `${shown} ${singular ? forms.one : forms.many}`; // spelled out, e.g. "reviews given"
  const l = label.toLowerCase();

  if (l === 'following') return singular ? `${shown} following` : `${shown} followings`;
  if (singular) {
    if (l === 'check-ins') return `${shown} check-in`;
    return l.endsWith('s') ? `${shown} ${l.slice(0, -1)}` : `${shown} ${l}`;
  }
  return l.endsWith('s') ? `${shown} ${l}` : `${shown} ${l}s`;
}

// "" for the first, "2nd " for the second, ... (with a trailing space, ready to put in front of a word)
export const ordinalPrefix = (position) => (position > 1 ? ordinal(position) + ' ' : '');
