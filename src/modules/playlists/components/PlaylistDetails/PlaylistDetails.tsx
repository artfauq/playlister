import React from 'react';

import { Card, HStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistStatistics, PlaylistTrackList } from '@src/components';
import { usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
};

export const PlaylistDetails: React.FC<Props> = ({ playlist }) => {
  const { data: playlistTracks } = usePlaylistTracksWithAudioFeatures(playlist.id);

  return (
    <>
      <HStack alignItems="flex-start" justifyContent="space-between">
        <PlaylistHeader playlist={playlist} coverSize="lg" />
        <PlaylistStatistics playlist={playlist} />
      </HStack>
      <Card flex={1}>
        <PlaylistTrackList tracks={playlistTracks} />
      </Card>
    </>
  );
};
