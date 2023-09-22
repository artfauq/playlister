import { NextPage } from 'next';
import React from 'react';

import { Layout, Loader } from '@src/components';
import { useSavedTracksCount } from '@src/hooks';
import { spotifyApi } from '@src/lib';
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
  const { data: savedTrackCount, status: savedTracksCountStatus } = useSavedTracksCount();

  if (savedTracksCountStatus !== 'success') {
    return <Loader fullScreen />;
  }

  return (
    <Layout>
      <SavedTracks savedTrackCount={savedTrackCount} />
    </Layout>
  );
};

export default SavedTracksPage;
