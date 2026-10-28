// Other social medias: General, E-commerce and Myspace accounts.
// Identified, counts, the free-text location, then activity and findings.
export const otherSocial = (c) => {
  const location = c.value(c.data.loc);
  let p = c.opening + c.metrics;
  if (location) p += `The subject listed ${c.proPoss} location as ${location}. `;
  return p + c.activity + c.findings;
};
