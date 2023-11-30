import React, { createContext, useCallback } from 'react';

import { Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Loader } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { Playlist } from '@src/types';
import { playlistDto } from '@src/utils';

const PlaylistsContext = createContext<Playlist[] | null>(null);

export const PlaylistsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useAppTranslation();
  const queryClient = useQueryClient();
  const previousPlaylists = queryClient.getQueryData<SpotifyApi.PlaylistObjectSimplified[]>([
    'playlists',
  ]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['playlists'],
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

  if (isError) return <Text>{t('errors:genericFetch')}</Text>;

  return <PlaylistsContext.Provider value={data}>{children}</PlaylistsContext.Provider>;
};

export const usePlaylistsContext = () => {
  const context = React.useContext(PlaylistsContext);

  if (context == null) {
    throw new Error('usePlaylistsContext() must be used within a <PlaylistsProvider />');
  }

  return context;
};
