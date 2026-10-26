// Progressive report, bullet 1: the intro.
// Null report: adds the "no accounts" sentence.
// Not null: the sentence listing the accounts found is added with the network slices.
export const name = 'progressive-intro';

const INTRO =
  `Searches of multiple social media sites including but not limited to Facebook, Instagram, X (Twitter), YouTube, LinkedIn, TikTok, Pinterest, Strava, Foursquare, and Tumblr, in addition to an in-depth Google search was performed with a specific analysis focused on the aforementioned categories. All provided information, as well as discovered information, was utilized in the search.`;

const NULL_SENTENCE = ` No social media accounts were found for the party at this time.`;

export const progressiveIntro = ({ isNull }) => (isNull ? INTRO + NULL_SENTENCE : INTRO);
