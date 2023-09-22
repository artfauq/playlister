import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Center, HStack } from '@chakra-ui/react';

import {
  Layout,
  Loader,
  PlaylistHeader,
  PlaylistStatistics,
  PlaylistTrackList,
} from '@src/components';
import { usePlaylist, usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import {} from '@src/lib/spotify-api';
import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { getSortedTrackIds, SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession<{}, { playlistId: string }>(
  async ({ params, queryClient, session }) => {
    if (!params?.playlistId) {
      return {
        notFound: true,
      };
    }

    await queryClient.prefetchQuery(['playlist', params.playlistId], () =>
      spotifyApi.fetchPlaylist(params.playlistId, {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    );
    await queryClient.prefetchQuery(['playlistTracks', params.playlistId], () =>
      spotifyApi.fetchPlaylistTracks(params.playlistId, {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    );

    const playlistTracks = queryClient.getQueryData<Track[]>(['playlistTracks', params.playlistId]);

    if (playlistTracks) {
      const trackIds = getSortedTrackIds(playlistTracks);

      await queryClient.prefetchQuery(
        ['tracksAudioFeatures', ...trackIds],
        () =>
          spotifyApi.fetchTracksAudioFeatures(trackIds, {
            Authorization: `Bearer ${session.accessToken}`,
          }),
        { staleTime: Infinity },
      );
    }

    return {
      props: {},
    };
  },
);

const PlaylistPage: NextPage = () => {
  const router = useRouter();
  const { data: playlist, status: playlistStatus } = usePlaylist(router.query.playlistId as string);
  const { data: playlistTracks, isLoading: fetchingTracksWithAudioFeatures } =
    usePlaylistTracksWithAudioFeatures(router.query.playlistId as string);

  if (playlistStatus !== 'success' || fetchingTracksWithAudioFeatures) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Layout>
      <HStack justify="space-between">
        <PlaylistHeader playlist={playlist} />
        <PlaylistStatistics playlistId={playlist.id} tracks={playlistTracks} />
      </HStack>
      <PlaylistTrackList tracks={playlistTracks} />
    </Layout>
  );
};

export default PlaylistPage;
