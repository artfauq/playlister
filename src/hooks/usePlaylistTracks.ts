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

  const limit = MAX_LIMIT;

  const queries = useQueries({
    queries: playlist
      ? Array.from({ length: Math.ceil(playlist.trackCount / limit) }, (_, i) => {
          const offset = i * limit;

          const queryOptions: UseQueryOptions<SpotifyApi.PlaylistTrackResponse, unknown, Track[]> =
            {
              queryKey: ['playlistTracks', playlistId, { limit, offset }],
              queryFn: () => spotifyApi.fetchPlaylistTracks(playlistId, { limit, offset }),
              select: data =>
                data.items.reduce<Track[]>(
                  (acc, track) =>
                    track.track ? [...acc, trackDto(track.track, track.added_at)] : acc,
                  [],
                ),
              staleTime: playlist.stale ? Infinity : 30 * 1000,
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
