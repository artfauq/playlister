import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@src/config';
import { spotifyApi } from '@src/lib';
import { playlistDto } from '@src/utils';

export const usePlaylist = (playlistId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    enabled: !!playlistId,
    queryKey: queryKeys.playlists.details(playlistId!).queryKey,
    queryFn: playlistId ? () => spotifyApi.fetchPlaylist(playlistId) : undefined,
    initialData: () => {
      const cachedPlaylist = queryClient
        .getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(queryKeys.playlists.all.queryKey)
        ?.find(p => p.id === playlistId);

      return cachedPlaylist;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(queryKeys.playlists.all.queryKey)?.dataUpdatedAt,
    select: playlist => {
      const cachedPlaylist =
        queryClient.getQueryData<SpotifyApi.SinglePlaylistResponse>(
          queryKeys.playlists.details(playlistId!).queryKey,
        ) ??
        queryClient
          .getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(queryKeys.playlists.all.queryKey)
          ?.find(p => p.id === playlistId);

      return playlist ? playlistDto(playlist, cachedPlaylist?.snapshot_id) : undefined;
    },
  });
};
