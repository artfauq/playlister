import React from 'react';

import { Box, Card, HStack, VStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistTrackList, SaveUnclassifiedButton } from '@src/components';
import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { useDuplicatedTracks, usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
};

export const PlaylistDetails: React.FC<Props> = ({ playlist }) => {
  const { data: playlistTracks } = usePlaylistTracksWithAudioFeatures(playlist.id);
  const { data: duplicatedTracks } = useDuplicatedTracks(playlist.id);

  return (
    <VStack align="stretch" flex={1} spacing="8">
      <HStack justify="space-between">
        <PlaylistHeader playlist={playlist} />
        {/* <PlaylistStatistics playlist={playlist} tracks={playlistTracks} /> */}
      </HStack>
      {playlist.name === UNCLASSIFIED_PLAYLIST_NAME && (
        <Box alignSelf="flex-start">
          <SaveUnclassifiedButton />
        </Box>
      )}
      <Card flex={1}>
        <PlaylistTrackList tracks={playlistTracks} duplicatedTracks={duplicatedTracks} />
      </Card>
    </VStack>
  );
};
