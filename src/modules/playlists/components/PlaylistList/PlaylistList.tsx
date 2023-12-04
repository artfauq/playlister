import NextLink from 'next/link';
import React from 'react';

import { LinkBox, LinkOverlay, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';

import { PlaylistCard } from '@src/components/PlaylistCard';
import { useAppTranslation, useSavedTracksCount } from '@src/hooks';
import { usePlaylists } from '@src/modules/playlists';
import { useCurrentUser } from '@src/modules/user';
import { getRoute } from '@src/routes';

type Props = {};

export const PlaylistList: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const currentUser = useCurrentUser();
  const playlists = usePlaylists();
  const { data: savedTracksCount, isError: fetchSavedTracksCountError } = useSavedTracksCount();

  if (savedTracksCount) {
    return (
      <SimpleGrid minChildWidth={220} spacing={8}>
        <LinkBox key="savedTracks">
          <LinkOverlay as={NextLink} href={getRoute('SavedTracks')}>
            <PlaylistCard
              playlist={{
                name: t('playlists:savedTracks'),
                coverImage: '/images/liked-song.png',
                owner: currentUser,
                public: null,
                trackCount: savedTracksCount,
              }}
            />
          </LinkOverlay>
        </LinkBox>

        {playlists.map(playlist => (
          <LinkBox key={playlist.id} h="80px">
            <LinkOverlay as={NextLink} href={getRoute('Playlist')(playlist.id)}>
              <PlaylistCard playlist={playlist} />
            </LinkOverlay>
          </LinkBox>
        ))}
      </SimpleGrid>
    );
  }

  if (fetchSavedTracksCountError) {
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
