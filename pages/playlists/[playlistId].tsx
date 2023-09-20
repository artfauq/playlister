import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Center, HStack } from '@chakra-ui/react';
import { dehydrate, DehydratedState, QueryClient } from '@tanstack/react-query';
import { getServerSession, Session } from 'next-auth';

import {
  Layout,
  Loader,
  PlaylistHeader,
  PlaylistStatistics,
  PlaylistTrackList,
} from '@src/components';
import { usePlaylist, usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { fetchPlaylist, fetchPlaylistTracks, fetchTracksAudioFeatures } from '@src/lib/spotify-api';
import { authOptions } from '@src/pages/api/auth/[...nextauth]';
import { Track } from '@src/types';
import { getSortedTrackIds } from '@src/utils';

type Props = {
  dehydratedState: DehydratedState;
  session: Session | null;
};

type Params = {
  playlistId: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  req,
  res,
  params,
}) => {
  const queryClient = new QueryClient();

  const session = await getServerSession(req, res, authOptions);

  if (!params?.playlistId) {
    return {
      notFound: true,
    };
  }

  if (!session?.accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery(['playlist', params.playlistId], () =>
    fetchPlaylist(params.playlistId, {
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );
  await queryClient.prefetchQuery(['playlistTracks', params.playlistId], () =>
    fetchPlaylistTracks(params.playlistId, {
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );

  const playlistTracks = queryClient.getQueryData<Track[]>(['playlistTracks', params.playlistId]);

  if (playlistTracks) {
    const trackIds = getSortedTrackIds(playlistTracks);

    await queryClient.prefetchQuery(
      ['tracksAudioFeatures', ...trackIds],
      () =>
        fetchTracksAudioFeatures(trackIds, {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      { staleTime: Infinity },
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      session,
    },
  };
};

const PlaylistPage: NextPage<Props> = () => {
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
