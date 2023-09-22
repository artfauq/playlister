import React from 'react';

import { Box, HStack } from '@chakra-ui/react';

import {
  Loader,
  PlaylistHeader,
  PlaylistStatistics,
  PlaylistTrackList,
  SaveUnclassifiedButton,
} from '@src/components';
import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
};

export const PlaylistDetails: React.FC<Props> = ({ playlist }) => {
  const { data: playlistTracks, isLoading: fetching } =
    usePlaylistTracksWithAudioFeatures(playlist);

  if (fetching) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <HStack justify="space-between">
        <PlaylistHeader playlist={playlist} />
        <PlaylistStatistics playlist={playlist} tracks={playlistTracks} />
      </HStack>
      <Box alignSelf="flex-start">
        {playlist.name === UNCLASSIFIED_PLAYLIST_NAME && <SaveUnclassifiedButton />}
      </Box>
      <PlaylistTrackList tracks={playlistTracks} />
    </>
  );
};
