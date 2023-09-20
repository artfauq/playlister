import { useQuery } from '@tanstack/react-query';

import { fetchUserPlaylists } from '@src/lib/spotify-api';

export const usePlaylists = () =>
  useQuery({
    queryKey: ['playlists'],
    queryFn: () => fetchUserPlaylists(),
  });
