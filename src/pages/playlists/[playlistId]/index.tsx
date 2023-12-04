import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Skeleton } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { queryKeys } from '@src/config';
import { withAuthentication } from '@src/hocs';
import { usePlaylist } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistDetails, PlaylistsProvider } from '@src/modules/playlists';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession<{}, { playlistId: string }>(
  async ({ params, queryClient, session }) => {
    if (!params?.playlistId) {
      return {
        notFound: true,
      };
    }

    await queryClient.prefetchQuery(queryKeys.playlists.details(params.playlistId).queryKey, () =>
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
    <>
      <NextSeo title={playlist.name} />
      <Layout>
        <PlaylistsProvider>
          <PlaylistDetails playlist={playlist} />
        </PlaylistsProvider>
      </Layout>
    </>
  );
};

export default withAuthentication(PlaylistPage);
