// Facebook: metrics, where from / lives, work and school, activity.
import { currentCity, previousCity, workAndSchool } from './parts.js';

export const facebook = (c) => {
  const from = previousCity(c);
  const lives = currentCity(c);
  let p = c.opening + c.metrics;

  if (from && lives) p += `The subject is from ${from} and is currently living in ${lives}. `;
  else if (from) p += `The subject is from ${from}. `;
  else if (lives) p += `The subject is currently living in ${lives}. `;

  return p + workAndSchool(c) + c.activity + c.findings;
};
