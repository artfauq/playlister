import { useQuery } from '@tanstack/react-query';

import queryClient from '@src/lib/query-client';
import { fetchPlaylist } from '@src/lib/spotify-api';
import { Playlist } from '@src/types';

export const usePlaylist = (playlistId: string) =>
  useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => fetchPlaylist(playlistId),
    placeholderData: () => {
      const playlists = queryClient.getQueryData<Playlist[]>(['playlists']);

      return playlists?.find(p => p.id === playlistId);
    },
  });
