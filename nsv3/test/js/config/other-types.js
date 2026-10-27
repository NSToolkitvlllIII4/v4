// Data only: the kinds of account on the "Other social medias" network.
//   l   the word used in the report sentence      ui  the label in the form
//   named: the person types the site's name (General, E-commerce); the others have a fixed name.
//   (A business account of any kind is written as a "page"; business websites exist only on Google.)
export const otherTypes = [
  { id: 'general', named: true, metrics: [
    { k: 'posts', ui: 'Posts', l: 'posts' },
    { k: 'followers', ui: 'Followers', l: 'followers' },
    { k: 'following', ui: 'Following', l: 'followings' },
  ] },
  { id: 'ecommerce', named: true, metrics: [
    { k: 'listings', ui: 'Listings', l: 'listing' },
    { k: 'followers', ui: 'Followers', l: 'followers' },
    { k: 'following', ui: 'Following', l: 'followings' },
  ] },
  { id: 'classmates', name: 'Classmates', metrics: [] },
  { id: 'myspace', name: 'Myspace', metrics: [
    { k: 'connectedTo', ui: 'Connected to', l: 'people connected to' },
    { k: 'connectedBy', ui: 'Connected by', l: 'people connected by' },
  ] },
  { id: 'mugshot', name: 'Mugshot', metrics: [] },
  { id: 'zoominfo', name: 'Zoominfo', metrics: [
    { k: 'connections', ui: 'Connections', l: 'connections' },
    { k: 'followers', ui: 'Followers', l: 'followers' },
  ] },
];

export const getOtherType = (id) => otherTypes.find((t) => t.id === id);
