import { useQuery, useQueryClient } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';
import { playlistDto } from '@src/utils';

export const usePlaylist = (playlistId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    enabled: !!playlistId,
    queryKey: ['playlists', playlistId, 'details'],
    queryFn: playlistId ? () => spotifyApi.fetchPlaylist(playlistId) : undefined,
    initialData: () => {
      const cachedPlaylist = queryClient
        .getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(['playlists'])
        ?.find(p => p.id === playlistId);

      return cachedPlaylist;
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(['playlists'])?.dataUpdatedAt,
    select: playlist => {
      const cachedPlaylist =
        queryClient.getQueryData<SpotifyApi.SinglePlaylistResponse>([
          'playlists',
          'detail',
          playlistId,
        ]) ??
        queryClient
          .getQueryData<SpotifyApi.PlaylistObjectSimplified[]>(['playlists'])
          ?.find(p => p.id === playlistId);

      return playlist ? playlistDto(playlist, cachedPlaylist?.snapshot_id) : undefined;
    },
  });
};
