import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Skeleton } from '@chakra-ui/react';

import { Layout } from '@src/components';
import { usePlaylist } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistDetails } from '@src/modules/PlaylistDetails';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession<{}, { playlistId: string }>(
  async ({ params, queryClient, session }) => {
    if (!params?.playlistId) {
      return {
        notFound: true,
      };
    }

    await queryClient.prefetchQuery(['playlists', 'detail', params.playlistId], () =>
      spotifyApi.apiRequest<SpotifyApi.SinglePlaylistResponse>({
        url: `/playlists/${params.playlistId}`,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }),
    );

    return {
      props: {},
    };
  },
);

const PlaylistPage: NextPage = () => {
  const router = useRouter();
  const { data: playlist } = usePlaylist(router.query.playlistId as string);

  if (!playlist) {
    return <Skeleton />;
  }

  return (
    <Layout>
      <PlaylistDetails playlist={playlist} />
    </Layout>
  );
};

export default PlaylistPage;
