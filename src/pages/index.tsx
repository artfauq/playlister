import { NextPage } from 'next';
import React from 'react';

import { Box, Button, Center, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FaSpotify } from 'react-icons/fa';

import { Layout } from '@src/components';
import { useAppTranslation, useCurrentUser } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { PlaylistList } from '@src/modules/PlaylistsPage';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ queryClient, session }) => {
  if (!session) {
    return { props: {} };
  }

  await queryClient.prefetchQuery(['playlists'], () =>
    spotifyApi.fetchPaginatedData<SpotifyApi.PlaylistObjectSimplified>({
      url: '/me/playlists',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params: {
        limit: 50,
      },
    }),
  );

  return {
    props: {},
  };
}, false);

const onSignIn = () => {
  signIn('spotify');
};

const Home: NextPage = () => {
  const currentUser = useCurrentUser();
  const { t } = useAppTranslation();

  if (!currentUser)
    return (
      <Layout showLogo={false}>
        <VStack as={Center} flex={1} spacing="8">
          <Box textAlign="center">
            <Heading as="h1">{t('home:title')}</Heading>
            <Text>{t('home:subtitle')}</Text>
          </Box>

          <Button
            bg="spotify.green"
            color="white"
            leftIcon={<Icon as={FaSpotify} />}
            onClick={onSignIn}
            size="lg"
            variant="outline"
            _hover={{ bg: 'spotify.green' }}
          >
            {t('common:signIn')}
          </Button>
        </VStack>
      </Layout>
    );

  return (
    <Layout>
      <VStack align="stretch" flex={1} mb="8" spacing="8">
        <Heading as="h1">{t('playlists:myPlaylists')}</Heading>
        <PlaylistList />
      </VStack>
    </Layout>
  );
};

export default Home;
