import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { Center, HStack } from '@chakra-ui/react';
import { dehydrate, DehydratedState, QueryClient } from '@tanstack/react-query';
import { getServerSession, Session } from 'next-auth';

import { Layout, Loader, PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useSavedTracks, useSavedTracksCount } from '@src/hooks';
import { countSavedTracks, fetchSavedTracks } from '@src/lib/spotify-api';
import { authOptions } from '@src/pages/api/auth/[...nextauth]';

type Props = {
  dehydratedState: DehydratedState;
  session: Session | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const queryClient = new QueryClient();

  const session = await getServerSession(req, res, authOptions);

  if (!session?.accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery(['savedTracks'], () =>
    fetchSavedTracks({
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );
  await queryClient.prefetchQuery(['savedTracksCount'], () =>
    countSavedTracks({
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      session,
    },
  };
};

const SavedTracksPage: NextPage<Props> = () => {
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
