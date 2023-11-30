import React, { useMemo } from 'react';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Loader } from '@src/components/Loader';
import { useAppTranslation, usePlaylistTracks } from '@src/hooks';
import { Playlist, TrackWithAudioFeatures } from '@src/types';
import {
  findDuplicateTracks,
  getHighestBpmTrack,
  getLowestBpmTrack,
  getTrackBpm,
  getTracksAverageBpm,
} from '@src/utils';

type Props = {
  playlist: Playlist;
  tracks: TrackWithAudioFeatures[];
};

export const PlaylistStatistics: React.FC<Props> = ({ playlist, tracks }) => {
  const { t } = useAppTranslation();
  const { data: playlistTracks, isLoading } = usePlaylistTracks(playlist.id);

  const duplicatedTracks = useMemo(() => {
    if (!playlistTracks) return undefined;

    return findDuplicateTracks(playlistTracks);
  }, [playlistTracks]);

  const averageBpm = useMemo(() => getTracksAverageBpm(tracks), [tracks]);
  const highestBpmTrack = useMemo(() => getHighestBpmTrack(tracks), [tracks]);
  const lowestBpmTrack = useMemo(() => getLowestBpmTrack(tracks), [tracks]);

  return (
    <SimpleGrid spacing={4} columns={[2, 4]}>
      <Card size="sm">
        <CardHeader>
          <Heading size="xs">{t('playlists:details.statistics.highestBpm')}</Heading>
        </CardHeader>
        <CardBody>
          <VStack align="flex-start" spacing="0">
            <Box as="span" fontSize="sm">
              {highestBpmTrack.name} - {highestBpmTrack.artists[0].name}
            </Box>

            <Box as="span" fontSize="sm">
              {getTrackBpm(highestBpmTrack)} BPM
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Card size="sm">
        <CardHeader>
          <Heading size="xs">{t('playlists:details.statistics.lowestBpm')}</Heading>
        </CardHeader>
        <CardBody>
          <VStack align="flex-start" spacing="0">
            <Box as="span" fontSize="sm">
              {lowestBpmTrack.name} - {lowestBpmTrack.artists[0].name}
            </Box>
            <Box as="span" fontSize="sm">
              {getTrackBpm(lowestBpmTrack)}
            </Box>
          </VStack>
        </CardBody>
      </Card>

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
          {isLoading ? <Loader /> : <Text fontSize="sm">{duplicatedTracks.length}</Text>}
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
