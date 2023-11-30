import React, { useEffect, useMemo } from 'react';

import { Button, Card, Center, HStack, useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PlaylistHeader, PlaylistTrackList } from '@src/components';
import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import {
  useAppTranslation,
  useCurrentUser,
  usePlaylistTracks,
  useUnclassifiedTracks,
} from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { usePlaylistsContext } from '@src/modules/playlists';
import { CreatePlaylistInput, Playlist, Track } from '@src/types';
import { playlistDto } from '@src/utils';

export const UnclassifiedTracksScreen: React.FC = () => {
  const { t } = useAppTranslation();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const playlists = usePlaylistsContext();
  const { data: unclassifiedTracks } = useUnclassifiedTracks();
  const unclassifiedPlaylist = playlists?.find(p => p.name === UNCLASSIFIED_PLAYLIST_NAME);
  const { data: unclassifiedPlaylistTracks } = usePlaylistTracks(unclassifiedPlaylist?.id);

  const { mutateAsync: createPlaylist } = useMutation({
    mutationFn: async ({ userId, values }: { userId: string; values: CreatePlaylistInput }) =>
      spotifyApi.createPlaylist(userId, values),
    onSuccess: playlist => {
      // queryClient.setQueryData(['playlists'], [...(playlists ?? []), playlist]);
      queryClient.setQueryData(['playlists', playlist.id, 'details'], playlist);
    },
  });
  const { mutate: saveUnclassified } = useMutation({
    mutationFn: async ({
      playlist,
      tracks,
      userId,
    }: {
      playlist: Playlist;
      tracks: Track[];
      userId: string;
    }) => {
      await spotifyApi.updatePlaylistTracks(playlist.id, tracks);
    },
  });

  const onSaveUnclassified = async () => {
    if (!currentUser?.id || !unclassifiedTracks) return;

    const playlist: Playlist =
      unclassifiedPlaylist ??
      (await createPlaylist({
        userId: currentUser.id,
        values: {
          name: 'TEST',
          collaborative: false,
          description:
            'A collection of your saved tracks that are not already in one of your playlists',
          public: false,
        },
      }).then(playlistDto));

    saveUnclassified({ playlist, tracks: unclassifiedTracks, userId: currentUser.id });
  };

  const toAddTracks = useMemo(() => {
    if (!unclassifiedTracks || !unclassifiedPlaylistTracks) return undefined;

    return unclassifiedTracks.filter(
      track =>
        !unclassifiedPlaylistTracks.find(unclassifiedTrack => unclassifiedTrack.id === track.id),
    );
  }, [unclassifiedTracks, unclassifiedPlaylistTracks]);

  const toRemoveTracks = useMemo(() => {
    if (!unclassifiedTracks || !unclassifiedPlaylistTracks) return undefined;

    return unclassifiedPlaylistTracks.filter(
      unclassifiedTrack => !unclassifiedTracks.find(track => track.id === unclassifiedTrack.id),
    );
  }, [unclassifiedTracks, unclassifiedPlaylistTracks]);

  useEffect(() => {
    if (!toAddTracks || !toRemoveTracks || toast.isActive('unclassified-tracks')) return;

    if (toAddTracks.length || toRemoveTracks.length) {
      toast({
        id: 'unclassified-tracks',
        title: 'Update needed',
        description: `Found ${toAddTracks.length} tracks to add and ${toRemoveTracks.length} tracks to remove from unclassified playlist.`,
        duration: 5000,
        status: 'warning',
      });
    } else {
      toast({
        id: 'unclassified-tracks',
        title: 'Unclassified playlist is up-to-date',
        duration: 5000,
        isClosable: true,
        status: 'success',
      });
    }
  }, [toAddTracks, toRemoveTracks, toast]);

  if (unclassifiedPlaylist) {
    return (
      <>
        <HStack justifyContent="space-between">
          <PlaylistHeader playlist={unclassifiedPlaylist} />
          <Button
            colorScheme="teal"
            // isLoading={isLoading}
            loadingText={t('common:refreshing')}
            onClick={onSaveUnclassified}
            variant="solid"
          >
            {t('playlists:saveUnclassified')}
          </Button>
        </HStack>
        <Card flex={1}>
          <PlaylistTrackList tracks={unclassifiedTracks} />
        </Card>
      </>
    );
  }

  return (
    <Center>
      <Button
        colorScheme="teal"
        // isLoading={isLoading}
        // loadingText={t('common:refreshing')}
        onClick={onSaveUnclassified}
        // size="sm"
        variant="solid"
      >
        Create unclassified playlist
      </Button>
    </Center>
  );
};
