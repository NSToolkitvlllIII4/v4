// Turning what a person typed into names and links for the report. Pure.
import { escapeHtml } from './text.js';

const BRAND_CASING = { linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok' };
const SECOND_LEVEL = new Set(['co', 'com', 'org', 'net', 'gov', 'edu', 'ac']); // bbc.co.uk, etc.

// Accepts a plain URL, a URL without https://, or pasted link HTML. Returns '' when there is nothing usable.
export function extractUrl(raw) {
  const text = (raw || '').trim();
  if (!text) return '';
  const href = text.match(/href=["']([^"']+)["']/i);
  const url = (href ? href[1] : text.replace(/<[^>]*>?/gm, '')).trim();
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : 'https://' + url;
}

// "https://www.facebook.com/x" -> "Facebook"; "m.facebook.com" -> "Facebook"; "bbc.co.uk" -> "Bbc"
export function siteLabel(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '');
    if (/^[\d.]+$/.test(host) || host.includes(':')) return 'Website'; // IP address
    const parts = host.split('.');
    let i = parts.length - 2;                       // the label before the ending (.com)
    if (i > 0 && SECOND_LEVEL.has(parts[i])) i -= 1; // skip .co in .co.uk
    const label = parts[Math.max(i, 0)];
    if (!label) return 'Website';
    return BRAND_CASING[label.toLowerCase()] ?? label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return 'Website';
  }
}

// A name, linked when there is a link. withSite adds the site name after it: "Jane (Facebook)".
export function nameHtml(name, rawLink, { withSite = false } = {}) {
  const clean = escapeHtml((name || '').trim());
  const url = extractUrl(rawLink);
  if (!url) return clean;
  const link = `<a href="${escapeHtml(url)}">${clean}</a>`;
  return withSite ? `${link} (${siteLabel(url)})` : link;
}
