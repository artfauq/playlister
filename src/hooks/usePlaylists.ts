import { useCallback } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';
import { playlistDto } from '@src/utils';

type SortBy = 'name';

export const usePlaylists = (sortBy: SortBy = 'name') => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['playlists'],
    queryFn: () => spotifyApi.fetchUserPlaylists(),
    select: useCallback(
      (playlists: SpotifyApi.PlaylistObjectSimplified[]) =>
        playlists
          .map(playlist => {
            const cachedPlaylist = queryClient
              .getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(['playlists'])
              ?.find(p => p.id === playlist.id);

            return playlistDto(playlist, cachedPlaylist?.snapshot_id);
          })
          .sort((a, b) => {
            switch (sortBy) {
              case 'name':
                return a.name.localeCompare(b.name);

              default:
                throw new Error(`Invalid sort by: ${sortBy as string}`);
            }
          }),
      [queryClient, sortBy],
    ),
    staleTime: 30 * 1000,
  });
};
