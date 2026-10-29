// Small unique ids for repeated rows, so each row keeps its own element when others are removed.
let next = 0;
export const uid = () => ++next;
// After restoring a saved session: make sure new ids never repeat ids that came back with it.
export const bumpUid = (n) => { if (Number.isFinite(n) && n > next) next = n; };
