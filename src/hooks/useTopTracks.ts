import { useQueries } from '@tanstack/react-query';
import ms from 'ms';

import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

type UseTopTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Track[];
      isLoading: false;
    };

export const useTopTracks = (): UseTopTracksResult => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['topTracks', { offset: 0 }],
        queryFn: async () => {
          const topTracks = await spotifyApi
            .fetchUserTopTracks({ limit: 50, offset: 0, time_range: 'medium_term' })
            .then(res => res.items);

          const trackIds = topTracks.map(track => track.id);
          const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);

          return topTracks.reduce<Track[]>((acc, track, index) => {
            const isSaved = savedTracksIndices[index];

            return [...acc, trackDto(track, null, isSaved)];
          }, []);
        },
        staleTime: ms('1d'),
      },
      {
        queryKey: ['topTracks', { offset: 50 }],
        queryFn: async () => {
          const topTracks = await spotifyApi
            .fetchUserTopTracks({ limit: 50, offset: 50, time_range: 'medium_term' })
            .then(res => res.items);

          const trackIds = topTracks.map(track => track.id);
          const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);

          return topTracks.reduce<Track[]>((acc, track, index) => {
            const isSaved = savedTracksIndices[index];

            return [...acc, trackDto(track, null, isSaved)];
          }, []);
        },
        staleTime: ms('1d'),
      },
    ],
  });

  const isLoading = queries.some(query => query.status === 'loading');

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
