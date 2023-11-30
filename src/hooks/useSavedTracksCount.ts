import { useQuery } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';

export const useSavedTracksCount = () =>
  useQuery({
    queryKey: ['savedTracksCount'],
    queryFn: () => spotifyApi.countSavedTracks(),
  });
