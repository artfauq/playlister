import { useQueries, UseQueryOptions } from '@tanstack/react-query';

import { SPOTIFY_SAVED_TRACKS_MAX_LIMIT } from '@src/constants';
import { useSavedTracksCount } from '@src/hooks/useSavedTracksCount';
import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

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

  const limit = SPOTIFY_SAVED_TRACKS_MAX_LIMIT;
  const queries = useQueries({
    queries:
      savedTracksCount != null
        ? Array.from({ length: Math.ceil(savedTracksCount / limit) }, (_, i) => {
            const offset = i * limit;

            const queryOptions: UseQueryOptions<
              SpotifyApi.UsersSavedTracksResponse,
              unknown,
              Track[]
            > = {
              queryKey: ['savedTracks', { offset, limit }],
              queryFn: () => spotifyApi.fetchSavedTracks({ limit, offset }),
              select: data =>
                data.items.reduce<Track[]>(
                  (acc, track) => [...acc, trackDto(track.track, null)],
                  [],
                ),
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

  return {
    data: queries.reduce<Track[]>((acc, query) => (query.data ? [...acc, ...query.data] : acc), []),
    isLoading: false,
  };
};
