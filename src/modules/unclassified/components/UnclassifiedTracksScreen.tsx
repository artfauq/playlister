import React, { useMemo } from 'react';

import { Button, Card, Center, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Loader, PlaylistHeader, PlaylistTrackList } from '@src/components';
import { queryKeys } from '@src/config';
import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { useAppTranslation, usePlaylistTracks, useUnclassifiedTracks } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { usePlaylists } from '@src/modules/playlists';
import { useCurrentUser } from '@src/modules/user';
import { CreatePlaylistInput, Playlist, Track } from '@src/types';
import { playlistDto } from '@src/utils';

export const UnclassifiedTracksScreen: React.FC = () => {
  const { t } = useAppTranslation();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const playlists = usePlaylists();
  const { data: unclassifiedTracks, isLoading } = useUnclassifiedTracks();
  const unclassifiedPlaylist = playlists?.find(p => p.name === UNCLASSIFIED_PLAYLIST_NAME);
  const {
    data: unclassifiedPlaylistTracks,
    isLoading: refreshing,
    refetch,
  } = usePlaylistTracks(unclassifiedPlaylist?.id);

  const { mutateAsync: createPlaylist } = useMutation({
    mutationFn: async ({ userId, values }: { userId: string; values: CreatePlaylistInput }) =>
      spotifyApi.createPlaylist(userId, values),
    onSuccess: playlist => {
      // queryClient.setQueryData(['playlists'], [...(playlists ?? []), playlist]);
      queryClient.setQueryData(queryKeys.playlists.details(playlist.id).queryKey, playlist);
    },
  });
  const { mutate: saveUnclassified, isLoading: saving } = useMutation({
    mutationFn: async ({
      playlist,
      toAddTracks,
      toRemoveTracks,
    }: {
      playlist: Playlist;
      toAddTracks: Track[];
      toRemoveTracks: Track[];
    }) => {
      await spotifyApi.addTracksToPlaylist(playlist.id, toAddTracks);
      await spotifyApi.removeTracksFromPlaylist(playlist.id, toRemoveTracks, playlist.snapshotId);
      await refetch();
    },
    onSuccess: async () => {
      toast({
        title: 'Done!',
        description: 'Unclassified playlist updated',
        status: 'success',
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.playlists.all.queryKey,
      });
    },
  });

  const onSaveUnclassified = async () => {
    if (!currentUser?.id || !toAddTracks || !toRemoveTracks) return;

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

    saveUnclassified({ playlist, toAddTracks, toRemoveTracks });
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

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (unclassifiedPlaylist) {
    return (
      <>
        <HStack justifyContent="space-between">
          <PlaylistHeader playlist={unclassifiedPlaylist} />
          {toAddTracks && toRemoveTracks && (
            <VStack alignItems="flex-end">
              <Button
                colorScheme="teal"
                isLoading={saving || refreshing}
                loadingText={t('common:refreshing')}
                onClick={onSaveUnclassified}
                variant="solid"
              >
                {t('playlists:saveUnclassified')}
              </Button>
              <Text>
                {toAddTracks.length} tracks to add and {toRemoveTracks.length} tracks to remove
              </Text>
            </VStack>
          )}
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
