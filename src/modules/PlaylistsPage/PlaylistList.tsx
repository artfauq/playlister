import NextLink from 'next/link';
import React from 'react';

import { Heading, LinkBox, LinkOverlay, SimpleGrid, Text } from '@chakra-ui/react';

import { Layout, Loader } from '@src/components';
import { PlaylistCard } from '@src/components/PlaylistCard';
import { useAppTranslation, usePlaylists, useSavedTracksCount } from '@src/hooks';

type Props = {};

export const PlaylistList: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const {
    data: playlists,
    isLoading: fetchingPlaylists,
    isSuccess: fetchPlaylistsSuccess,
  } = usePlaylists();
  const {
    data: savedTracksCount,
    isLoading: fetchingSavedTracksCount,
    isSuccess: savedTracksCountSuccess,
  } = useSavedTracksCount();

  if (fetchingPlaylists || fetchingSavedTracksCount) {
    return <Loader fullScreen />;
  }

  if (!fetchPlaylistsSuccess || !savedTracksCountSuccess) return <Text>Failed to load</Text>;

  return (
    <Layout>
      <Heading as="h1">{t('playlists:myPlaylists')}</Heading>

      <SimpleGrid minChildWidth={220} spacing={8}>
        <LinkBox key="savedTracks">
          <LinkOverlay as={NextLink} href="/playlists/saved">
            <PlaylistCard
              playlist={{
                coverImage: '/images/liked-song.png',
                name: t('playlists:savedTracks'),
                trackCount: savedTracksCount,
              }}
            />
          </LinkOverlay>
        </LinkBox>

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
