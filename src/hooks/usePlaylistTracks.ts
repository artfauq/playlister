import { useQuery } from '@tanstack/react-query';

import { fetchPlaylistTracks } from '@src/lib/spotify-api';

export const usePlaylistTracks = (playlistId?: string) =>
  useQuery({
    queryKey: ['playlistTracks', playlistId],
    queryFn: playlistId ? async () => fetchPlaylistTracks(playlistId) : undefined,
    enabled: !!playlistId,
  });
