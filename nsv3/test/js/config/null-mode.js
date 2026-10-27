// Null report: the subject has no social media, so only the search-based networks can still be used.
// While Null is "Yes", every network not listed here is dimmed in the sidebar, hidden in the form, and left out of the
// report and its counts (what was typed stays stored, so switching Null back to "No" brings it all back).
export const NULL_NETWORKS = ['goog', 'other'];

export const isNullAllowed = (netId) => NULL_NETWORKS.includes(netId);

// Is this network out of play right now?
export const nullOff = (isNull, netId) => Boolean(isNull) && !isNullAllowed(netId);
