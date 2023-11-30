import React, { Fragment } from 'react';

import {
  Badge,
  Card,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CiTrash } from 'react-icons/ci';

import { PlaylistCover, TrackSummary } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { DuplicateReason, Playlist, Track } from '@src/types';
import { mapObjectsByKey } from '@src/utils';

type Props = {
  sourcePlaylist: Playlist;
  duplicateTracks: Array<{
    sourceTrack: Track;
    targetTrack: Track;
    duplicateReason: DuplicateReason;
  }>;
  targetPlaylist: Playlist;
};

export const PlaylistDuplicateTracks: React.FC<Props> = ({
  sourcePlaylist,
  targetPlaylist,
  duplicateTracks,
}) => {
  const { t } = useAppTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: removeTracks } = useMutation({
    mutationFn: ({ playlist, tracks }: { playlist: Playlist; tracks: Track[] }) =>
      spotifyApi.removeTracksFromPlaylist(playlist.id, tracks, playlist.snapshotId),
    onError: () => {
      toast({
        title: t('errors:genericMutate'),
        status: 'success',
      });
    },
    onSuccess: (_, variables) => {
      toast({
        // TODO: translate + take into account track count
        title: 'Track(s) deleted',
        status: 'success',
      });

      queryClient.setQueryData(
        ['playlists', variables.playlist.id, 'tracks'],
        (prevTracks: SpotifyApi.PlaylistTrackObject[] | undefined) => {
          if (prevTracks) {
            const deletedTrackUris = mapObjectsByKey(variables.tracks, 'uri');
            const updatedTracks = prevTracks.filter(
              track => track.track && !deletedTrackUris.includes(track.track.uri),
            );

            return updatedTracks;
          }

          return prevTracks;
        },
      );
    },
  });

  return (
    <VStack as={Card} align="stretch" spacing="4" px={{ base: '4', lg: '8' }} py="4">
      <HStack justify="space-between">
        <HStack>
          <PlaylistCover imageUrl={sourcePlaylist.coverImage} alt={sourcePlaylist.name} size="sm" />
          <Heading size="sm" noOfLines={1}>
            {sourcePlaylist.name}
          </Heading>
          <IconButton
            aria-label="Remove source playlist tracks"
            icon={<CiTrash />}
            onClick={() =>
              removeTracks({
                playlist: sourcePlaylist,
                tracks: duplicateTracks.map(({ sourceTrack }) => sourceTrack),
              })
            }
            variant="ghost"
          />
        </HStack>
        <HStack justify="flex-end">
          <IconButton
            aria-label="Remove target playlist tracks"
            icon={<CiTrash />}
            onClick={() =>
              removeTracks({
                playlist: targetPlaylist,
                tracks: duplicateTracks.map(({ targetTrack }) => targetTrack),
              })
            }
            variant="ghost"
          />
          <PlaylistCover imageUrl={targetPlaylist.coverImage} alt={targetPlaylist.name} size="sm" />
          <Heading size="sm" noOfLines={1}>
            {targetPlaylist.name}
          </Heading>
        </HStack>
      </HStack>

      {duplicateTracks.length ? (
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          {duplicateTracks.map(({ sourceTrack, targetTrack, duplicateReason }, index) => (
            <Fragment key={`${sourceTrack.id}-${targetTrack.id}-${duplicateReason}_${index}`}>
              <GridItem colSpan={2}>
                <HStack>
                  <IconButton
                    aria-label="Remove track"
                    icon={<CiTrash />}
                    onClick={() =>
                      removeTracks({ playlist: sourcePlaylist, tracks: [sourceTrack] })
                    }
                    variant="ghost"
                  />
                  <TrackSummary track={sourceTrack} />
                </HStack>
              </GridItem>

              <GridItem>
                <Center h="100%">
                  <Badge borderRadius="full" colorScheme="orange" lineHeight="base" m="auto" px="2">
                    {t(`deduplicate:duplicateReason.${duplicateReason}`)}
                  </Badge>
                </Center>
              </GridItem>

              <GridItem colSpan={2}>
                <HStack justify="flex-end">
                  <TrackSummary track={targetTrack} />
                  <IconButton
                    aria-label="Remove track"
                    icon={<CiTrash />}
                    onClick={() =>
                      removeTracks({ playlist: targetPlaylist, tracks: [targetTrack] })
                    }
                    variant="ghost"
                  />
                </HStack>
              </GridItem>
            </Fragment>
          ))}
        </Grid>
      ) : (
        <Text align="center">{t('deduplicate:emptyResult')}</Text>
      )}
    </VStack>
  );
};
