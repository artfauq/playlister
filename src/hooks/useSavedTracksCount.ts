import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@src/config';
import { spotifyApi } from '@src/lib';

export const useSavedTracksCount = () =>
  useQuery({
    queryKey: queryKeys.savedTracks.count().queryKey,
    queryFn: () => spotifyApi.countSavedTracks(),
  });
