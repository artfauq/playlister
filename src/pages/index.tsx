import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { Button, Center } from '@chakra-ui/react';
import { dehydrate, DehydratedState, QueryClient } from '@tanstack/react-query';
import { getServerSession, Session } from 'next-auth';
import { signIn } from 'next-auth/react';

import { useAppTranslation, useCurrentUser } from '@src/hooks';
import { fetchUserPlaylists } from '@src/lib/spotify-api';
import { PlaylistList } from '@src/modules/PlaylistsPage';
import { authOptions } from '@src/pages/api/auth/[...nextauth]';

type Props = {
  dehydratedState?: DehydratedState;
  session: Session | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const queryClient = new QueryClient();

  const session = await getServerSession(req, res, authOptions);

  if (!session?.accessToken) {
    return {
      props: {
        session: null,
      },
    };
  }

  await queryClient.prefetchQuery(['playlists'], () =>
    fetchUserPlaylists({
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

const Home: NextPage<Props> = () => {
  const currentUser = useCurrentUser();
  const { t } = useAppTranslation();

  if (!currentUser)
    return (
      <Center h="100%">
        <Button onClick={() => signIn()} variant="outline">
          {t('common:signIn')}
        </Button>
      </Center>
    );

  return <PlaylistList />;
};

export default Home;
