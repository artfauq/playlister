import { useQuery } from '@tanstack/react-query';

import { countSavedTracks } from '@src/lib/spotify-api';

export const useSavedTracksCount = () =>
  useQuery({
    queryKey: ['savedTracksCount'],
    queryFn: () => countSavedTracks(),
  });
