/**
 * Every piece of copy and every outbound link on the site lives here, so the
 * page can grow without hunting through markup.
 */

export const site = {
  name: 'BRUMA JARABACOA',
  shortName: 'BRUMA',
  url: 'https://bruma.do',
  title: 'BRUMA JARABACOA — Born in the Mountains',
  description:
    'An evolving collection of thoughtful places inspired by the landscape and spirit of Jarabacoa, Dominican Republic.',
  locale: 'en',
  place: {
    locality: 'Jarabacoa',
    region: 'La Vega',
    country: 'Dominican Republic',
  },
  instagram: {
    handle: '@brumajarabacoa',
    url: 'https://www.instagram.com/brumajarabacoa/',
  },
  ogImage: '/og-bruma-jarabacoa.jpg',
} as const;

export const hero = {
  statement: 'Born in the mountains.',
  tagline: 'Thoughtful places shaped by nature, calm, and the spirit of Jarabacoa.',
  cue: 'Discover',
} as const;

export const intro = {
  eyebrow: 'Jarabacoa, Dominican Republic',
  heading: 'A quieter way of being.',
  body: 'Bruma is an evolving collection of places inspired by the landscape and spirit of Jarabacoa — created for slower mornings, meaningful gatherings, and a deeper connection with nature.',
} as const;

export const closing = {
  heading: 'Something is taking shape in the mountains.',
  status: 'Coming soon',
  invitation: 'Follow the beginning',
} as const;
