import React from 'react';

import { Card, HStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useSavedTracks, useSavedTracksCount } from '@src/hooks';
import { useCurrentUser } from '@src/modules/user';

type Props = {};

export const SavedTracks: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const currentUser = useCurrentUser();
  const { data: playlistTracks } = useSavedTracks();
  const { data: savedTracksCount } = useSavedTracksCount();

  return (
    <>
      <HStack justify="space-between">
        <PlaylistHeader
          playlist={{
            name: t('playlists:savedTracks'),
            coverImage: '/images/liked-song.png',
            owner: currentUser,
            public: false,
            trackCount: savedTracksCount,
          }}
        />
      </HStack>
      <Card flex={1}>
        <PlaylistTrackList tracks={playlistTracks} />
      </Card>
    </>
  );
};
