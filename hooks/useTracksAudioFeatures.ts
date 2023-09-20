import { useQuery } from '@tanstack/react-query';

import { fetchTracksAudioFeatures } from '@src/lib/spotify-api';

export const useTracksAudioFeatures = (trackIds: string[]) => {
  return useQuery({
    queryKey: ['tracksAudioFeatures', ...trackIds],
    queryFn: async () => fetchTracksAudioFeatures(trackIds),
    enabled: !!trackIds.length,
    staleTime: Infinity,
  });
};
