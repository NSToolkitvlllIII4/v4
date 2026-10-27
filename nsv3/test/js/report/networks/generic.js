// Everything without its own wording (Strava, Foursquare, Tumblr): metrics, location, activity.
import { currentCity } from './parts.js';

export const generic = (c) => {
  const lives = currentCity(c);
  let p = c.opening + c.metrics;
  if (lives) p += `The subject listed ${c.proPoss} location as ${lives}. `;
  return p + c.activity + c.findings;
};
