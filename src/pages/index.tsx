import { NextPage } from 'next';
import React from 'react';

import { Button, Center } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

import { useAppTranslation, useCurrentUser } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistList } from '@src/modules/PlaylistsPage';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ queryClient, session }) => {
  if (!session) {
    return { props: {} };
  }

  await queryClient.prefetchQuery(['playlists'], () =>
    spotifyApi.fetchUserPlaylists({
      Authorization: `Bearer ${session.accessToken}`,
    }),
  );

  return {
    props: {},
  };
}, false);

const Home: NextPage = () => {
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
