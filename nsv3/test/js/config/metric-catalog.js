// Data only: counts that can be added to an "other social medias" account with the "+ Add metric" button.
//   ui   the label in the form     one / many   how it reads in a sentence ("1 like", "5 likes")
export const metricCatalog = [
  { k: 'posts', ui: 'Posts', one: 'post', many: 'posts' },
  { k: 'friends', ui: 'Friends', one: 'friend', many: 'friends' },
  { k: 'followers', ui: 'Followers', one: 'follower', many: 'followers' },
  { k: 'following', ui: 'Following', one: 'following', many: 'followings' },
  { k: 'likes', ui: 'Likes', one: 'like', many: 'likes' },
  { k: 'comments', ui: 'Comments', one: 'comment', many: 'comments' },
  { k: 'photos', ui: 'Photos', one: 'photo', many: 'photos' },
  { k: 'videos', ui: 'Videos', one: 'video', many: 'videos' },
  { k: 'tracks', ui: 'Tracks', one: 'track', many: 'tracks' },
  { k: 'reels', ui: 'Reels', one: 'reel', many: 'reels' },
  { k: 'views', ui: 'Views', one: 'view', many: 'views' },
  { k: 'subscribers', ui: 'Subscribers', one: 'subscriber', many: 'subscribers' },
  { k: 'connections', ui: 'Connections', one: 'connection', many: 'connections' },
  { k: 'groups', ui: 'Groups', one: 'group', many: 'groups' },
  { k: 'checkins', ui: 'Check-ins', one: 'check-in', many: 'check-ins' },
  { k: 'reviews', ui: 'Reviews', one: 'review', many: 'reviews' },
  { k: 'reviewsGiven', ui: 'Reviews given', one: 'review given', many: 'reviews given' },
  { k: 'ratings', ui: 'Ratings', one: 'rating', many: 'ratings' },
  { k: 'listings', ui: 'Listings', one: 'listing', many: 'listings' },
  { k: 'pins', ui: 'Pins', one: 'pin', many: 'pins' },
  { k: 'boards', ui: 'Boards', one: 'board', many: 'boards' },
  { k: 'endorsements', ui: 'Endorsements', one: 'endorsement', many: 'endorsements' },
];

export const getCatalogMetric = (key) => metricCatalog.find((m) => m.k === key);
