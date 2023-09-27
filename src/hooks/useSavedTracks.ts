import { useQueries, UseQueryOptions } from '@tanstack/react-query';

import { useSavedTracksCount } from '@src/hooks/useSavedTracksCount';
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

export const useSavedTracks = (): UseSavedTracksResult => {
  const { data: savedTracksCount, isLoading: fetchingSavedTracksCount } = useSavedTracksCount();

  const queries = useQueries({
    queries:
      savedTracksCount != null
        ? Array.from({ length: Math.ceil(savedTracksCount / MAX_LIMIT) }, (_, i) => {
            const offset = i * MAX_LIMIT;

            const queryOptions: UseQueryOptions<
              SpotifyApi.UsersSavedTracksResponse,
              unknown,
              Track[]
            > = {
              queryKey: ['savedTracks', { offset }],
              queryFn: () => spotifyApi.fetchSavedTracks({ limit: MAX_LIMIT, offset }),
              select: data =>
                data.items.reduce<Track[]>(
                  (acc, track) => [...acc, trackDto(track.track, track.added_at, true)],
                  [],
                ),
              staleTime: 60 * 1000,
            };

            return queryOptions;
          })
        : [],
  });

  const isLoading = queries.some(query => query.isLoading) || fetchingSavedTracksCount;

  if (isLoading) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  const data = queries.reduce<Track[]>(
    (acc, query) => (query.data ? [...acc, ...query.data] : acc),
    [],
  );
  return {
    data,
    isLoading: false,
  };
};
