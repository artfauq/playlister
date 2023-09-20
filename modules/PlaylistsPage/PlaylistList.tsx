import NextLink from 'next/link';
import React from 'react';

import { Heading, LinkBox, LinkOverlay, SimpleGrid, Text } from '@chakra-ui/react';

import { Layout, Loader } from '@src/components';
import { PlaylistCard } from '@src/components/PlaylistCard';
import { useAppTranslation, usePlaylists } from '@src/hooks';

type Props = {};

export const PlaylistList: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const { data: playlists, error, isLoading, isSuccess } = usePlaylists();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error || !isSuccess) return <Text>Failed to load</Text>;

  return (
    <Layout>
      <Heading as="h1">{t('playlists:myPlaylists')}</Heading>

      <SimpleGrid minChildWidth={220} spacing={8}>
        {playlists.map(playlist => (
          <LinkBox key={playlist.id}>
            <LinkOverlay as={NextLink} href={`/playlists/${playlist.id}`}>
              <PlaylistCard playlist={playlist} />
            </LinkOverlay>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Layout>
  );
};
