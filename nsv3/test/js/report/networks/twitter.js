// X (Twitter): location and joined date.
import { currentCity, joined } from './parts.js';

export const twitter = (c) => {
  const lives = currentCity(c);
  const since = joined(c);
  let p = c.opening + c.metrics;

  if (lives && since) p += `The subject listed ${c.proPoss} location as ${lives} and joined X (Twitter) in ${since}. `;
  else if (lives) p += `The subject listed ${c.proPoss} location as ${lives}. `;
  else if (since) p += `The subject joined X (Twitter) in ${since}. `;

  return p + c.activity + c.findings;
};
