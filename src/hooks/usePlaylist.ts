import { useQuery } from '@tanstack/react-query';

import { queryClient, spotifyApi } from '@src/lib';
import { Playlist } from '@src/types';

export const usePlaylist = (playlistId: string) =>
  useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => spotifyApi.fetchPlaylist(playlistId),
    placeholderData: () => {
      const playlists = queryClient.getQueryData<Playlist[]>(['playlists']);

      return playlists?.find(p => p.id === playlistId);
    },
  });
