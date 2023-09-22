import { useQuery } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';

export const useSavedTracks = () =>
  useQuery({
    queryKey: ['savedTracks'],
    queryFn: () => spotifyApi.fetchSavedTracks(),
  });
