import NextLink from 'next/link';
import React from 'react';

import { LinkBox, LinkOverlay, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';

import { PlaylistCard } from '@src/components/PlaylistCard';
import { useAppTranslation, useCurrentUser, usePlaylists, useSavedTracksCount } from '@src/hooks';

type Props = {};

export const PlaylistList: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const currentUser = useCurrentUser();
  const { data: playlists, isError: fetchPlaylistsError } = usePlaylists();
  const { data: savedTracksCount, isError: fetchSavedTracksCountError } = useSavedTracksCount();

  if (playlists && savedTracksCount) {
    return (
      <SimpleGrid minChildWidth={220} spacing={8}>
        <LinkBox key="savedTracks">
          <LinkOverlay as={NextLink} href="/playlists/saved">
            <PlaylistCard
              playlist={{
                name: t('playlists:savedTracks'),
                coverImage: '/images/liked-song.png',
                owner: currentUser?.name,
                public: null,
                trackCount: savedTracksCount,
              }}
            />
          </LinkOverlay>
        </LinkBox>

        {playlists.map(playlist => (
          <LinkBox key={playlist.id} h="80px">
            <LinkOverlay as={NextLink} href={`/playlists/${playlist.id}`}>
              <PlaylistCard playlist={playlist} />
            </LinkOverlay>
          </LinkBox>
        ))}
      </SimpleGrid>
    );
  }

  if (fetchPlaylistsError || fetchSavedTracksCountError) {
    return <Text>{t('errors:genericFetch')}</Text>;
  }

  return (
    <SimpleGrid minChildWidth={220} spacing={8}>
      {Array.from({ length: 20 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={index} h="80px" />
      ))}
    </SimpleGrid>
  );
};
