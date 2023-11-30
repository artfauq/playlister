import { type DefaultSeoProps } from 'next-seo';

import { config } from '@src/config/app.config';

export const defaultSEOConfig: DefaultSeoProps = {
  defaultTitle: `${config.appName} - Manage your Spotify playlists`,
  titleTemplate: `%s | ${config.appName}`,
  description:
    'View and manage your Spotify playlists with ease. Search for duplicate tracks and save unclassified tracks and top tracks inside a playlist',
  canonical: config.appUrl,
  openGraph: {
    images: [
      {
        url: `${config.appUrl}/images/logo.png`,
        width: 512,
        height: 512,
        alt: config.appName,
      },
    ],
    locale: 'en_US',
    siteName: config.appName,
    type: 'website',
    url: config.appUrl,
  },
  languageAlternates: [],
};
