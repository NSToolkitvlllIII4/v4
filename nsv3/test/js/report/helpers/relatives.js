// Pieces shared by the two relatives paragraphs. Pure.
export const validRows = (rows) => rows.filter((r) => (r.name || '').trim() !== '');

// Wording that changes with how many were identified.
export const countWords = (count) => ({
  verb: count === 1 ? 'was' : 'were',
  noun: count === 1 ? 'This account was' : 'These accounts were',
  pronoun: count === 1 ? 'it' : 'them',
});
