import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { SavedTracks } from '@src/modules/SavedTracks';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ queryClient, session }) => {
  await queryClient.prefetchQuery(
    ['savedTracksCount'],
    () =>
      spotifyApi.apiRequest<SpotifyApi.UsersSavedTracksResponse>({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          limit: 1,
        },
      }),
    {
      staleTime: 60 * 1000,
    },
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
        <SavedTracks />
      </Layout>
    </>
  );
};

export default SavedTracksPage;
