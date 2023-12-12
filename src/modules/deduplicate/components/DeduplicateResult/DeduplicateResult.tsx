import React from 'react';

import { Text, VStack } from '@chakra-ui/react';

import { Loader } from '@src/components';
import { useDuplicatedTracks } from '@src/hooks';
import { PlaylistDuplicateTracks } from '@src/modules/deduplicate/components/DeduplicateResult/components/PlaylistDuplicateTracks';
import { usePlaylists } from '@src/modules/playlists';

type Props = {
  sourcePlaylistId: string;
  targetPlaylistIds: string[];
};

export const DeduplicateResult: React.FC<Props> = ({ sourcePlaylistId, targetPlaylistIds }) => {
  const playlists = usePlaylists();
  const { data: duplicatedTracks } = useDuplicatedTracks(sourcePlaylistId, targetPlaylistIds);

  if (duplicatedTracks) {
    const sourcePlaylist = playlists.find(p => p.id === sourcePlaylistId);

    if (!sourcePlaylist) return null;

    const hasDuplicates = Object.keys(duplicatedTracks).length;

    if (!hasDuplicates) return <Text>No duplicates found</Text>;

    return (
      <VStack align="stretch" spacing="10">
        {Object.entries(duplicatedTracks).map(([targetPlaylistId, duplicateTracks]) => {
          const targetPlaylist = playlists.find(p => p.id === targetPlaylistId);

          if (!targetPlaylist) return null;

          return (
            <PlaylistDuplicateTracks
              key={targetPlaylistId}
              sourcePlaylist={sourcePlaylist}
              targetPlaylist={targetPlaylist}
              duplicateTracks={duplicateTracks}
            />
          );
        })}
      </VStack>
    );
  }

  return <Loader fullScreen />;
};
