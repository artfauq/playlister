import { useQuery } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';

export const usePlaylistTracks = (playlistId?: string) =>
  useQuery({
    queryKey: ['playlistTracks', playlistId],
    queryFn: playlistId ? async () => spotifyApi.fetchPlaylistTracks(playlistId) : undefined,
    enabled: !!playlistId,
  });
