// YouTube: joined date.
import { joined } from './parts.js';

export const youtube = (c) => {
  const since = joined(c);
  let p = c.opening + c.metrics;
  if (since) p += `It is stated that the subject joined YouTube on ${since}. `;
  return p + c.activity + c.findings;
};
