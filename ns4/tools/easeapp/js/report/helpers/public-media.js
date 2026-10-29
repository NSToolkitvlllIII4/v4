// What the Public accounts (someone else's public post, photo or video) are called in the Progressive bullets.
//   one:   "a public photo on Poshmark"
//   more:  "public posts and photos on Facebook"  (the kinds found, then the networks)
import { escapeHtml, joinList } from './text.js';

const KINDS = ['post', 'photo', 'video'];

// mentions: [{ net, media }] from buildTally().progressive.mentions. Returns null when there are none.
export function publicPhrase(mentions) {
  if (!mentions.length) return null;
  const nets = [...new Set(mentions.map((m) => m.net))].map(escapeHtml);
  if (mentions.length === 1) return `a public ${mentions[0].media} on ${nets[0]}`;
  const kinds = KINDS.filter((k) => mentions.some((m) => m.media === k)).map((k) => `${k}s`);
  return `public ${joinList(kinds)} on ${joinList(nets)}`;
}
