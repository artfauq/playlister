import { type DefaultSeoProps } from 'next-seo';

import { config } from '@src/config/app.config';

export const defaultSEOConfig: DefaultSeoProps = {
  defaultTitle: 'Playlister',
  description: 'View and manage your Spotify playlists with ease.',
  titleTemplate: `%s | ${config.appName}`,
  // canonical: '',
  // themeColor: '',
  // openGraph: {},
};
