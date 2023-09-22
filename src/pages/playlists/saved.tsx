import { NextPage } from 'next';
import React from 'react';

import { Center, HStack } from '@chakra-ui/react';

import { Layout, Loader, PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useSavedTracks, useSavedTracksCount } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ queryClient, session }) => {
  await queryClient.prefetchQuery(['savedTracks'], () =>
    spotifyApi.fetchSavedTracks({
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );
  await queryClient.prefetchQuery(['savedTracksCount'], () =>
    spotifyApi.countSavedTracks({
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );

  return {
    props: {},
  };
});

const SavedTracksPage: NextPage = () => {
  const { t } = useAppTranslation();
  const { data: playlistTracks, status: savedTracksStatus } = useSavedTracks();
  const { data: savedTracksCount, status: savedTracksCountStatus } = useSavedTracksCount();

  if (savedTracksStatus !== 'success' || savedTracksCountStatus !== 'success') {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Layout>
      <HStack justify="space-between">
        <PlaylistHeader
          playlist={{
            coverImage: '/images/liked-song.png',
            name: t('playlists:savedTracks'),
            trackCount: savedTracksCount,
          }}
        />
      </HStack>
      <PlaylistTrackList tracks={playlistTracks} />
    </Layout>
  );
};

export default SavedTracksPage;
