import React from 'react';

import { HStack } from '@chakra-ui/react';

import { Loader, PlaylistHeader, PlaylistTrackList } from '@src/components';
import { useAppTranslation, useSavedTracks } from '@src/hooks';

type Props = {
  savedTrackCount: number;
};

export const SavedTracks: React.FC<Props> = ({ savedTrackCount }) => {
  const { t } = useAppTranslation();
  const { data: playlistTracks, isLoading } = useSavedTracks(savedTrackCount);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <HStack justify="space-between">
        <PlaylistHeader
          playlist={{
            coverImage: '/images/liked-song.png',
            name: t('playlists:savedTracks'),
            trackCount: savedTrackCount,
          }}
        />
      </HStack>
      <PlaylistTrackList tracks={playlistTracks} />
    </>
  );
};
