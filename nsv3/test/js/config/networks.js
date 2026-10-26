// Data only: the static facts about each network. No behavior, no UI state.
// (Runtime state such as "checked" and the clone list lives in a store, not here.)
//
// Fields
//   id     short key used everywhere (store, events, section ids)
//   name   label shown in the UI and the report
//   short  tile text in the sidebar rail
//   color  brand color, used later to accent each network's form section
//   config the generic network form; null means the network has its own custom section
//     metrics   count fields to show, as { k: key, l: label }
//     joined    show a "joined" field
//     locPrev   show previous city
//     locCurr   show current city
//     workEd    show employment and school
//     activity  show account status (activity) fields

// forms: how the count reads in a sentence when it isn't just the label plus "s" ({ one, many })
const m = (k, l, forms) => (forms ? { k, l, forms } : { k, l });

export const networks = [
  {
    id: 'fb', name: 'Facebook', short: 'FB', color: '#1877F2',
    config: {
      metrics: [m('posts', 'Posts'), m('friends', 'Friends'), m('followers', 'Followers'), m('following', 'Following'), m('photos', 'Photos'), m('videos', 'Reels'), m('checkins', 'Check-Ins'), m('likes', 'Reviews given', { one: 'review given', many: 'reviews given' })],
      locPrev: true, locCurr: true, workEd: true, joined: false, activity: true,
    },
  },
  {
    id: 'ig', name: 'Instagram', short: 'IG', color: '#E1306C',
    config: {
      metrics: [m('posts', 'Posts'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: false, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'tw', name: 'X (Twitter)', short: 'X', color: '#1DA1F2',
    config: {
      metrics: [m('posts', 'Posts'), m('following', 'Following'), m('followers', 'Followers'), m('photos', 'Photos')],
      locPrev: false, locCurr: true, workEd: false, joined: true, activity: true,
    },
  },
  {
    id: 'yt', name: 'YouTube', short: 'YT', color: '#FF0000',
    config: {
      metrics: [m('videos', 'Videos'), m('subscribers', 'Subscribers')],
      locPrev: false, locCurr: false, workEd: false, joined: true, activity: true,
    },
  },
  {
    id: 'li', name: 'LinkedIn', short: 'LI', color: '#0A66C2',
    config: {
      metrics: [m('connections', 'Connections'), m('followers', 'Followers')],
      locPrev: false, locCurr: true, workEd: true, joined: false, activity: false,
    },
  },
  {
    id: 'tk', name: 'TikTok', short: 'TK', color: '#000000',
    config: {
      metrics: [m('posts', 'Posts'), m('following', 'Following'), m('followers', 'Followers'), m('likes', 'Likes')],
      locPrev: false, locCurr: false, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'pin', name: 'Pinterest', short: 'PI', color: '#E60023',
    config: {
      metrics: [m('pins', 'Pins'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: false, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'str', name: 'Strava', short: 'ST', color: '#FC4C02',
    config: {
      metrics: [m('posts', 'Posts'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: true, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'fs', name: 'Foursquare', short: '4S', color: '#F94877',
    config: {
      metrics: [m('posts', 'Posts'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: true, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'tum', name: 'Tumblr', short: 'TU', color: '#36465D',
    config: {
      metrics: [m('posts', 'Posts'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: true, workEd: false, joined: false, activity: true,
    },
  },
  {
    id: 'thr', name: 'Threads', short: 'TH', color: '#000000',
    config: {
      metrics: [m('posts', 'Posts'), m('followers', 'Followers'), m('following', 'Following')],
      locPrev: false, locCurr: false, workEd: false, joined: false, activity: true,
    },
  },

  // Custom sections (no generic config): Google / PSE data, and the Others sub-types.
  { id: 'goog',  name: 'Google', short: 'G', color: '#4285F4', config: null },
  { id: 'other', name: 'Others', short: '+', color: '#9b59b6', config: null },
];

export const getNetwork = (id) => networks.find((n) => n.id === id);

// Networks that use the generic form, in sidebar order.
export const genericNetworks = networks.filter((n) => n.config);
