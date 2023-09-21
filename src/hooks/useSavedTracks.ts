import { useQuery } from '@tanstack/react-query';

import { fetchSavedTracks } from '@src/lib/spotify-api';

export const useSavedTracks = () =>
  useQuery({
    queryKey: ['savedTracks'],
    queryFn: () => fetchSavedTracks(),
  });
