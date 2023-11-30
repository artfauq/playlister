import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistsProvider } from '@src/modules/playlists';
import { SavedTracks } from '@src/modules/SavedTracks';
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
    <>
      <NextSeo title={t('playlists:savedTracks')} />
      <Layout>
        <PlaylistsProvider>
          <SavedTracks />
        </PlaylistsProvider>
      </Layout>
    </>
  );
};

export default SavedTracksPage;
