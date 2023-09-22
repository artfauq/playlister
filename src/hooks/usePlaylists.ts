import { useQuery } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';

export const usePlaylists = () =>
  useQuery({
    queryKey: ['playlists'],
    queryFn: () => spotifyApi.fetchUserPlaylists(),
  });
