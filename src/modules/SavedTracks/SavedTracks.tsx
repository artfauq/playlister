import React from 'react';

import { HStack } from '@chakra-ui/react';

import { Loader, PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useCurrentUser, useSavedTracks } from '@src/hooks';

type Props = {};

export const SavedTracks: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const currentUser = useCurrentUser();
  const { data: playlistTracks, isLoading } = useSavedTracks();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <HStack justify="space-between">
        <PlaylistHeader
          playlist={{
            name: t('playlists:savedTracks'),
            coverImage: '/images/liked-song.png',
            owner: currentUser,
            public: false,
            trackCount: playlistTracks.length,
          }}
        />
      </HStack>
      <PlaylistTrackList tracks={playlistTracks} />
    </>
  );
};
