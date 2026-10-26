// Pages: a personal page or a business page (not a person's account). Any network can have them.
// Same sentence for both, only the word changes: "A personal page on Facebook ..." / "A business page on Facebook ...".
// Written after all the accounts, personal pages first, then business pages, each in network order.
// Business websites are not here: they exist only on Google (see google/business.js).
import { joinList } from '../helpers/text.js';

// Kinds of "other" account that have a location field
const HAS_LOCATION = ['general', 'ecommerce', 'myspace', 'zoominfo'];

function page(c, kind) {
  const { data } = c;

  // Pages count their own 2nd, 3rd ... (ord); "possible" is not part of that count.
  if (c.isPossible) {
    return `A ${c.ord}possible ${kind} page on ${c.name} was found by ${c.idBy}. ${c.findings}`;
  }

  const metrics = c.metricItems.length ? `This page has ${joinList(c.metricItems)}. ` : '';

  // A personal page on Others also says where the subject listed their location
  let location = '';
  if (kind === 'personal' && c.net.id === 'other' && HAS_LOCATION.includes(data.subType)) {
    const where = c.value(data.loc);
    if (where) location = `The subject listed ${c.proPoss} location as ${where}. `;
  }

  let activity = '';
  if (data.activity === 'inactive') activity = 'The page is inactive. ';
  else if (data.activity === 'private') activity = 'The page is set to private. ';
  else if (data.activity === 'active') {
    const date = c.value(data.actDate, '(Month Day, Year)');
    const action = c.value(data.actDetails, '(shared a post/photo etc)');
    activity = `The page was last active on ${date} when the page ${action}. `;
  }

  return `A ${c.ord}${kind} page on ${c.name} was identified by ${c.idBy}. ${metrics}${location}${activity}${c.findings}`;
}

export const business = (c) => page(c, 'business');
export const personalPage = (c) => page(c, 'personal');
