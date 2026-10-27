// One pass over everything that was entered, counting what the closing bullet (Plus) and the
// summing-up bullets (Progressive) need. Pure: state in, numbers and lists out.
import { networks as config } from '../config/networks.js';
import { pseText } from './networks/google/pse-names.js';
import { nullOff } from '../config/null-mode.js';

const isPublic = (data) => data.accountType === 'no-page'; // shown as "Public" in the form

export function buildTally({ reportType, isNull, relatives, networks: state = {} }) {
  const tally = {
    personalCount: 0,         // personal accounts (matched)
    personalPageCount: 0,     // personal pages (including ones found through search engines)
    businessCount: 0,         // business pages (including business pages found through search engines)
    googleBusinessCount: 0,   // business websites found through search engines
    possibleSocialCount: 0,   // possible accounts
    mugshotCount: 0,
    possibleMugshotCount: 0,
    hasMentions: false,       // anything found only through a public post, photo or video
    hasGoogle: false,
    hasPossibleGoogle: false,
    googleCount: 0,           // search engine results (matched and possible; not business or public mentions)
    hasGlobalRH: false,       // relevant information found anywhere
    hasNetworkRH: false,      // ...on a network (not just through relatives)
  };

  // Lists the Progressive bullets will sentence together
  // (Names are the network, or the search engines for Google. Business pages and websites are kept apart.)
  const progressive = { personalNets: [], personalPageNets: [], businessNets: [], websiteNets: [], mentionNets: [], mugshots: 0, google: false };
  const allProgTexts = []; // Progressive findings typed on networks
  const relProgTexts = []; // ...and on relatives

  // Relatives
  if (reportType === 'plus') {
    if (relatives.found === true && relatives.finding === 'relevant') tally.hasGlobalRH = true;
  } else if (reportType === 'progressive') {
    if (relatives.found === true && relatives.progFindings) {
      for (const pf of relatives.progFindings) {
        if (pf.type === 'relevant') tally.hasGlobalRH = true;
        if (pf.text && pf.text.trim() !== '') relProgTexts.push(pf.text.trim());
      }
    }
  }

  // Networks, in sidebar order
  for (const net of config) {
    const st = state[net.id];
    if (!st?.checked) continue;
    if (nullOff(isNull, net.id)) continue; // Null report: only Google and Others count

    for (const data of st.instances) {
      // Relevant information
      if (reportType === 'plus') {
        if (data.finding === 'relevant') { tally.hasGlobalRH = true; tally.hasNetworkRH = true; }
      } else if (reportType === 'progressive' && data.progFindings) {
        for (const pf of data.progFindings) {
          if (pf.type === 'relevant') { tally.hasGlobalRH = true; tally.hasNetworkRH = true; }
          if (pf.text && pf.text.trim() !== '') allProgTexts.push(pf.text.trim());
        }
      }

      if (net.id === 'goog') {
        const engines = pseText(data.pseNames) || '(public search engine)';
        if (data.accountType === 'business-website') {  // business website
          progressive.websiteNets.push(engines);
          tally.googleBusinessCount++;
        } else if (data.accountType === 'personal-page') { // personal page
          progressive.personalPageNets.push(engines);
          tally.personalPageCount++;
        } else if (data.accountType === 'business-page') { // business page
          progressive.businessNets.push(engines);
          tally.businessCount++;
        } else if (isPublic(data)) {
          progressive.mentionNets.push(engines);
          tally.hasMentions = true;
        } else {
          progressive.google = true;
          tally.googleCount++;
          if (data.matchStatus === 'possible') tally.hasPossibleGoogle = true;
          else tally.hasGoogle = true;
        }
        continue;
      }

      // The name Progressive uses for this account (Mugshots are counted, not named)
      let name = net.name;
      if (net.id === 'other') {
        if (data.subType === 'mugshot') {
          progressive.mugshots++;
          name = null;
        } else if (['general', 'ecommerce', 'myspace', 'zoominfo', 'classmates'].includes(data.subType)) {
          name = data.networkName ? data.networkName.trim() : 'Other';
        } else {
          name = null;
        }
      }
      if (name) {
        if (data.accountType === 'business-page') progressive.businessNets.push(name);
        else if (data.accountType === 'personal-page') progressive.personalPageNets.push(name);
        else if (isPublic(data)) progressive.mentionNets.push(name);
        else progressive.personalNets.push(name);
      }

      // The counts for the closing bullet. An account is counted once, in the first group that fits.
      if (isPublic(data)) tally.hasMentions = true;
      else if (net.id === 'other' && data.subType === 'mugshot') {
        if (data.matchStatus === 'possible') tally.possibleMugshotCount++;
        else tally.mugshotCount++;
      } else if (data.matchStatus === 'possible') tally.possibleSocialCount++;
      else if (data.accountType === 'personal-page') tally.personalPageCount++;
      else if (data.accountType === 'business-page') tally.businessCount++;
      else tally.personalCount++;
    }
  }

  return { tally, progressive, allProgTexts, relProgTexts };
}
