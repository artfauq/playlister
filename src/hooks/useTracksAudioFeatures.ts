import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@src/config';
import { spotifyApi } from '@src/lib';

export const useTracksAudioFeatures = (trackIds: string[]) => {
  return useQuery({
    queryKey: queryKeys.tracksAudioFeatures.list(trackIds).queryKey,
    queryFn: async () => spotifyApi.fetchTracksAudioFeatures(trackIds),
    enabled: !!trackIds.length,
    staleTime: Infinity,
  });
};
