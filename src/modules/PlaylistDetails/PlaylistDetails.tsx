import React from 'react';

import { Card, HStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistTrackList } from '@src/components';
import { usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
};

export const PlaylistDetails: React.FC<Props> = ({ playlist }) => {
  const { data: playlistTracks } = usePlaylistTracksWithAudioFeatures(playlist.id);

  return (
    <>
      <HStack justify="space-between">
        <PlaylistHeader playlist={playlist} coverSize="lg" />
        {/* <PlaylistStatistics playlist={playlist} tracks={playlistTracks} /> */}
      </HStack>
      <Card flex={1}>
        <PlaylistTrackList tracks={playlistTracks} withAudioFeatures />
      </Card>
    </>
  );
};
