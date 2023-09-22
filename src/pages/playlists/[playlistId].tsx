import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Layout, Loader } from '@src/components';
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

    await queryClient.prefetchQuery(['playlist', params.playlistId], () =>
      spotifyApi.fetchPlaylist(params.playlistId, {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    );

    return {
      props: {},
    };
  },
);

const PlaylistPage: NextPage = () => {
  const router = useRouter();
  const { data: playlist, status: playlistStatus } = usePlaylist(router.query.playlistId as string);

  if (playlistStatus !== 'success') {
    return <Loader fullScreen />;
  }

  return (
    <Layout>
      <PlaylistDetails playlist={playlist} />
    </Layout>
  );
};

export default PlaylistPage;
