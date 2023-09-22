import { useQuery } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';

export const useTracksAudioFeatures = (trackIds: string[]) => {
  return useQuery({
    queryKey: ['tracksAudioFeatures', ...trackIds],
    queryFn: async () => spotifyApi.fetchTracksAudioFeatures(trackIds),
    enabled: !!trackIds.length,
    staleTime: Infinity,
  });
};
