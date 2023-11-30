module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'navigation', 'errors'],
    '/': ['home', 'playlists'],
    '/deduplicate': ['playlists', 'tracks', 'deduplicate'],
    '/saved': ['playlists', 'tracks'],
    '/top-tracks': ['playlists', 'tracks'],
    '/unclassified': ['playlists', 'tracks'],
    'rgx:^/playlists/*': ['playlists', 'tracks'],
  },
  loadLocaleFrom: async (locale, namespace) =>
    import(`./src/locales/${locale}/${namespace}`).then(r => r.default),
};
