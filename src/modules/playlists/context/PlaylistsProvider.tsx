import React, { createContext, useCallback, useContext } from 'react';

import { Center, Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Loader } from '@src/components';
import { queryKeys } from '@src/config';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { useCurrentUser } from '@src/modules/user';
import { Playlist } from '@src/types';
import { playlistDto } from '@src/utils';

const PlaylistsContext = createContext<Playlist[] | null>(null);

export const PlaylistsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useAppTranslation();
  const queryClient = useQueryClient();
  const previousPlaylists = queryClient.getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(
    queryKeys.playlists.all.queryKey,
  );

  const { data, isError, isLoading } = useQuery({
    queryKey: queryKeys.playlists.all.queryKey,
    queryFn: () => spotifyApi.fetchUserPlaylists(),
    select: useCallback(
      (items: SpotifyApi.PlaylistObjectSimplified[]) =>
        items
          .map(playlist => {
            const previousPlaylist = previousPlaylists?.find(p => p.id === playlist.id);

            return playlistDto(playlist, previousPlaylist?.snapshot_id);
          })
          .sort((a, b) => a.name.localeCompare(b.name)),
      [previousPlaylists],
    ),
  });

  if (isLoading) return <Loader fullScreen loadingText={t('playlists:fetching')} />;

  if (isError)
    return (
      <Center flex={1}>
        <Text>{t('errors:genericFetch')}</Text>
      </Center>
    );

  return <PlaylistsContext.Provider value={data}>{children}</PlaylistsContext.Provider>;
};

export const usePlaylists = (ownedByUser?: boolean) => {
  const playlists = useContext(PlaylistsContext);
  const currentUser = useCurrentUser();

  if (playlists == null) {
    throw new Error('usePlaylists() must be used within a <PlaylistsProvider />');
  }

  return ownedByUser ? playlists.filter(p => p.owner?.id === currentUser.id) : playlists;
};
