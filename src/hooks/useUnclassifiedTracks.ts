import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@src/lib';
import { trackDto } from '@src/utils';

export const useUnclassifiedTracks = () => {
  return useQuery({
    queryKey: ['unclassifiedTracks'],
    queryFn: () => fetcher<SpotifyApi.SavedTrackObject[]>('/api/unclassified-tracks'),
    select: tracks => tracks.map(track => trackDto(track.track, null)),
  });
};
