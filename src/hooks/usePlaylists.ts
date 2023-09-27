import { useCallback } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';
import { playlistDto } from '@src/utils';

type SortBy = 'name';

export const usePlaylists = (sortBy: SortBy = 'name') => {
  const queryClient = useQueryClient();
  const previousPlaylists = queryClient.getQueryData<SpotifyApi.PlaylistObjectSimplified[]>([
    'playlists',
  ]);

  return useQuery({
    queryKey: ['playlists'],
    queryFn: () => spotifyApi.fetchUserPlaylists(),
    select: useCallback(
      (playlists: SpotifyApi.PlaylistObjectSimplified[]) =>
        playlists
          .map(playlist => {
            const previousPlaylist = previousPlaylists?.find(p => p.id === playlist.id);

            return playlistDto(playlist, previousPlaylist?.snapshot_id);
          })
          .sort((a, b) => {
            switch (sortBy) {
              case 'name':
                return a.name.localeCompare(b.name);

              default:
                throw new Error(`Invalid sort by: ${sortBy as string}`);
            }
          }),
      [previousPlaylists, sortBy],
    ),
    staleTime: 60 * 1000,
  });
};
