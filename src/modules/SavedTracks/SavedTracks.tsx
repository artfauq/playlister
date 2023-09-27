import React from 'react';

import { HStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useCurrentUser, useSavedTracks, useSavedTracksCount } from '@src/hooks';

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
            owner: currentUser?.name,
            public: false,
            trackCount: savedTracksCount,
          }}
        />
      </HStack>
      <PlaylistTrackList tracks={playlistTracks} />
    </>
  );
};
