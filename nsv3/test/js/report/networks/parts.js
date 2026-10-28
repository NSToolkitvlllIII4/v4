// Sentence pieces shared by several networks. Pure.
import { article } from '../helpers/grammar.js';

const city = (c, field) => (field.on ? c.value(field.val, '(City, State)') : '');

// The work clause: "works as an engineer at Acme". Empty when employment is not switched on.
// If only one of the two fields is filled, the other half is left out (no placeholder for it):
//   both:  works as an engineer at Acme    only employer:  works at Acme    only nature:  works as an engineer
// Nothing typed yet: both placeholders show, "works as a (Nature of work) at (Employment)".
export function employment(c) {
  const { emp, nature } = c.data.workEd;
  if (!emp.on) return '';

  const typedNature = (nature.val || '').trim() ? nature.val : '';
  const typedEmployer = (emp.val || '').trim() ? emp.val : '';
  const nothingTyped = !typedNature && !typedEmployer;
  const job = nothingTyped ? '(Nature of work)' : typedNature;
  const employer = nothingTyped ? '(Employment)' : typedEmployer;

  const as = (text) => article(text.trim()).toLowerCase();
  if (job && employer) return `works as ${as(job)} ${c.value(job)} at ${c.value(employer)}`;
  if (job) return `works as ${as(job)} ${c.value(job)}`;
  return `works at ${c.value(employer)}`;
}

// Work and school, as one or two sentences (Facebook style)
export function workAndSchool(c) {
  const { workEd } = c.data;
  const school = workEd.school.on ? (workEd.school.val || '(School)') : '';
  const work = employment(c);
  const job = work ? `${c.proSubjCap} ${work}` : '';
  const study = school ? `studied at ${c.value(school)}` : '';

  if (job && study) return `${job} and ${c.proSubj} ${study}. `;
  if (job) return `${job}. `;
  if (study) return `${c.proSubjCap} ${study}. `;
  return '';
}

// Current city and joined date, as one sentence (X / Twitter style)
export const currentCity = (c) => city(c, c.data.loc.curr);
export const previousCity = (c) => city(c, c.data.loc.prev);
export const joined = (c) => (c.data.joined ? c.value(c.data.joined) : '');
