// Small unique ids for repeated rows, so each row keeps its own element when others are removed.
let next = 0;
export const uid = () => ++next;
