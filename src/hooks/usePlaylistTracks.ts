import { useQueries, UseQueryOptions } from '@tanstack/react-query';

import { usePlaylist } from '@src/hooks/usePlaylist';
import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

const MAX_LIMIT = 100;

type UsePlaylistTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Track[];
      isLoading: false;
    };

export const usePlaylistTracks = (playlistId: string): UsePlaylistTracksResult => {
  const { data: playlist } = usePlaylist(playlistId);

  const queries = useQueries({
    queries: playlist
      ? Array.from({ length: Math.ceil(playlist.trackCount / MAX_LIMIT) }, (_, i) => {
          const offset = i * MAX_LIMIT;

          const queryOptions: UseQueryOptions<Track[]> = {
            queryKey: ['playlistTracks', playlistId, { offset }],
            queryFn: async () => {
              const playlistTracks = await spotifyApi
                .fetchPlaylistTracks(playlistId, { limit: MAX_LIMIT, offset })
                .then(tracks =>
                  tracks.items.filter(item => !!item.track).map(track => track.track!),
                );

              const trackIds = playlistTracks.map(track => track.id);
              const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);

              return playlistTracks.reduce<Track[]>((acc, track, index) => {
                const isSaved = savedTracksIndices[index];

                return [...acc, trackDto(track, isSaved)];
              }, []);
            },
            staleTime: playlist.stale ? Infinity : 60 * 1000,
          };

          return queryOptions;
        })
      : [],
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
