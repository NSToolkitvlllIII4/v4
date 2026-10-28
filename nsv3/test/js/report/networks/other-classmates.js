// Classmates: school and class year.
export const otherClassmates = (c) => {
  const school = c.value(c.data.school, '(School)');
  const year = c.value(c.data.classYear, '(Year)');
  return `${c.opening}${c.metrics}It is stated that the subject went to ${school}, Class of ${year}. ${c.findings}`;
};
