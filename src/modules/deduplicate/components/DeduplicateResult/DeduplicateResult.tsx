import React from 'react';

import { Card, Text, VStack } from '@chakra-ui/react';

import { Loader } from '@src/components';
import { useAppTranslation, useDuplicatedTracks } from '@src/hooks';
import { PlaylistDuplicateTracks } from '@src/modules/deduplicate/components/DeduplicateResult/components/PlaylistDuplicateTracks';
import { usePlaylists } from '@src/modules/playlists';

type Props = {
  sourcePlaylistId: string;
  targetPlaylistIds: string[];
};

export const DeduplicateResult: React.FC<Props> = ({ sourcePlaylistId, targetPlaylistIds }) => {
  const { t } = useAppTranslation();
  const playlists = usePlaylists();
  const { data: duplicatedTracks } = useDuplicatedTracks(sourcePlaylistId, targetPlaylistIds);

  if (duplicatedTracks) {
    const sourcePlaylist = playlists.find(p => p.id === sourcePlaylistId);

    if (!sourcePlaylist) return null;

    const hasDuplicates = Object.keys(duplicatedTracks).length;

    if (!hasDuplicates) {
      return (
        <Card align="center" justify="center" minH={200} p="4">
          <Text>{t('deduplicate:emptyResult')}</Text>
        </Card>
      );
    }

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
