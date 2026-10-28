// LinkedIn: location first, then metrics, work, school. No activity sentence.
import { currentCity, employment } from './parts.js';

export const linkedin = (c) => {
  const { workEd } = c.data;
  const lives = currentCity(c);
  let p = c.opening;
  if (lives) p += `The subject listed ${c.proPoss} location as ${lives}. `;
  p += c.metrics;

  const work = employment(c);
  if (work) p += `It is stated that the subject ${work}. `;
  const school = workEd.school.on ? (workEd.school.val || '(School)') : '';
  if (school) p += `${c.proSubjCap} studied at ${c.value(school)}. `;

  return p + c.findings;
};
