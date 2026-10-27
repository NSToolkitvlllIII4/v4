// Picks the wording for an "other social medias" account by its kind.
import { otherSocial } from './other-social.js';
import { otherZoominfo } from './other-zoominfo.js';
import { otherClassmates } from './other-classmates.js';
import { otherMugshot } from './other-mugshot.js';

const BY_KIND = {
  general: otherSocial,
  ecommerce: otherSocial,
  myspace: otherSocial,
  zoominfo: otherZoominfo,
  classmates: otherClassmates,
  mugshot: otherMugshot,
};

export const other = (c) => (BY_KIND[c.data.subType] ?? otherSocial)(c);
