import React from 'react';

import { Box, HStack, VStack } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistTrackList, SaveUnclassifiedButton } from '@src/components';
import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
};

export const PlaylistDetails: React.FC<Props> = ({ playlist }) => {
  const { data: playlistTracks, isLoading: fetching } = usePlaylistTracksWithAudioFeatures(
    playlist.id,
  );

  return (
    <VStack align="stretch" spacing="4">
      <HStack justify="space-between">
        <PlaylistHeader playlist={playlist} />
        {/* <PlaylistStatistics playlist={playlist} tracks={playlistTracks} /> */}
      </HStack>
      <Box alignSelf="flex-start">
        {playlist.name === UNCLASSIFIED_PLAYLIST_NAME && <SaveUnclassifiedButton />}
      </Box>
      {!fetching && <PlaylistTrackList tracks={playlistTracks} />}
    </VStack>
  );
};
