module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'errors'],
    '/': ['home', 'playlists'],
    'rgx:^/playlists/*': ['playlists', 'tracks'],
  },
  loadLocaleFrom: async (locale, namespace) =>
    import(`./src/locales/${locale}/${namespace}`).then(r => r.default),
};
