// Plus report: one paragraph per network account. Returns a list.
import { networkParagraphs, networkEntries } from '../networks/index.js';

export const name = 'networks-plus';

export const networksPlus = (state) => networkParagraphs(state);
// Who each paragraph belongs to (same order), so the page can find an account's bullet.
networksPlus.owners = (state) => networkEntries(state).map((e) => e.owner);
