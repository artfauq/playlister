import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { withAuthentication } from '@src/hocs';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistsProvider, SavedTracks } from '@src/modules/playlists';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ queryClient, session }) => {
  await queryClient.prefetchQuery(['savedTracksCount'], () =>
    spotifyApi.apiRequest<SpotifyApi.UsersSavedTracksResponse>({
      url: 'https://api.spotify.com/v1/me/tracks',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params: {
        limit: 1,
      },
    }),
  );

  return {
    props: {},
  };
});

const SavedTracksPage: NextPage = () => {
  const { t } = useAppTranslation();

  return (
    <PlaylistsProvider>
      <NextSeo title={t('playlists:savedTracks')} />
      <Layout>
        <SavedTracks />
      </Layout>
    </PlaylistsProvider>
  );
};

export default withAuthentication(SavedTracksPage);
