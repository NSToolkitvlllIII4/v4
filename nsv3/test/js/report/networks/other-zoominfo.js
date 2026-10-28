// Zoominfo: location, counts, work, school.
import { employment } from './parts.js';

export const otherZoominfo = (c) => {
  const { loc, workEd } = c.data;
  const location = c.value(loc);
  let p = c.opening;
  if (location) p += `The subject listed ${c.proPoss} location as ${location}. `;
  p += c.metrics;

  const work = employment(c);
  if (work) p += `It is stated that the subject ${work}. `;
  const school = workEd.school.on ? (workEd.school.val || '(School)') : '';
  if (school) p += `${c.proSubjCap} studied at ${c.value(school)}. `;

  return p + c.findings;
};
