// Business accounts (a page, not a person's account). Any network can have one.
// They are written after all the personal accounts, in the same network order.
// A General or E-commerce account on "other social medias" is a business Website instead of a page.
import { joinList } from '../helpers/text.js';
import { getOtherType } from '../../config/other-types.js';

export const business = (c) => {
  const { data } = c;
  const website = c.net.id === 'other' && !!getOtherType(data.subType)?.website;
  // Websites are named by what the person typed ("website" when blank), pages by the network.
  const websiteName = c.value((data.networkName || '').trim(), 'website');
  const noun = website ? 'Website' : 'page';
  const lower = website ? 'website' : 'page';

  // Business pages count their own 2nd, 3rd ... (ord); "possible" is not part of that count.
  if (c.isPossible) {
    return `A ${c.ord}possible business ${noun} on ${website ? websiteName : c.name} was found by ${c.idBy}. ${c.findings}`;
  }

  const metrics = c.metricItems.length ? `This ${lower} has ${joinList(c.metricItems)}. ` : '';

  let activity = '';
  if (data.activity === 'inactive') activity = `The ${lower} is inactive. `;
  else if (data.activity === 'private') activity = `The ${lower} is set to private. `;
  else if (data.activity === 'active') {
    const date = c.value(data.actDate, '(Month Day, Year)');
    const action = c.value(data.actDetails, '(shared a post/photo etc)');
    activity = website && data.subType === 'ecommerce'
      ? `The website was last active on ${date}. `
      : `The ${lower} was last active on ${date} when the ${lower} ${action}. `;
  }

  if (website) {
    return `A ${c.ord}business Website on ${websiteName} was identified by ${c.idBy}. This website contains information about the business. ${metrics}${activity}${c.findings}`;
  }
  return `A ${c.ord}business page on ${c.name} was identified by ${c.idBy}. ${metrics}${activity}${c.findings}`;
};
