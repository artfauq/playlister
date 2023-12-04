import React, { useMemo } from 'react';

import { Card, CardBody, CardHeader, Heading, SimpleGrid, Text } from '@chakra-ui/react';

import { Loader } from '@src/components/Loader';
import { useAppTranslation, usePlaylistTracksWithAudioFeatures } from '@src/hooks';
import { Playlist } from '@src/types';
import { findDuplicateTracks, getTracksAverageBpm } from '@src/utils';

type Props = {
  playlist: Playlist;
};

export const PlaylistStatistics: React.FC<Props> = ({ playlist }) => {
  const { t } = useAppTranslation();
  const { data: playlistTracks, isLoading } = usePlaylistTracksWithAudioFeatures(playlist.id);

  const duplicatedTracks = useMemo(() => {
    if (!playlistTracks) return undefined;

    return findDuplicateTracks(playlistTracks);
  }, [playlistTracks]);

  if (!playlistTracks) return null;

  const averageBpm = getTracksAverageBpm(playlistTracks);

  return (
    <SimpleGrid spacing={4} columns={2}>
      <Card size="sm">
        <CardHeader>
          <Heading size="xs">{t('playlists:details.statistics.averageBpm')}</Heading>
        </CardHeader>
        <CardBody>
          <Text fontSize="sm">{averageBpm}</Text>
        </CardBody>
      </Card>

      <Card size="sm">
        <CardHeader>
          <Heading size="xs">{t('playlists:details.statistics.duplicatedTracks')}</Heading>
        </CardHeader>
        <CardBody>
          {isLoading ? <Loader /> : <Text fontSize="sm">{duplicatedTracks?.length}</Text>}
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
