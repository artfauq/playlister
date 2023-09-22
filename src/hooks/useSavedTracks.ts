import { useQueries, UseQueryOptions } from '@tanstack/react-query';

import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

const MAX_LIMIT = 50;

type UseSavedTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Track[];
      isLoading: false;
    };

export const useSavedTracks = (trackCount: number): UseSavedTracksResult => {
  const limit = MAX_LIMIT;

  const queries = useQueries({
    queries: Array.from({ length: Math.ceil(trackCount / limit) }, (_, i) => {
      const offset = i * limit;

      const queryOptions: UseQueryOptions<SpotifyApi.UsersSavedTracksResponse, unknown, Track[]> = {
        queryKey: ['savedTracks', limit, offset],
        queryFn: () => spotifyApi.fetchSavedTracks({ limit, offset }),
        select: data =>
          data.items.reduce<Track[]>(
            (acc, track) => [...acc, trackDto(track.track, track.added_at)],
            [],
          ),
      };

      return queryOptions;
    }),
  });

  const isLoading = queries.some(query => query.isLoading);

  if (isLoading) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  const data = queries
    .reduce<Track[]>((acc, query) => (query.data ? [...acc, ...query.data] : acc), [])
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    data,
    isLoading: false,
  };
};
