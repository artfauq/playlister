import { useQueries, UseQueryOptions } from '@tanstack/react-query';

import { usePlaylist } from '@src/hooks/usePlaylist';
import { useSavedTracks } from '@src/hooks/useSavedTracks';
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
  const { data: savedTracks, isLoading: fetchingSavedTracks } = useSavedTracks();

  const limit = MAX_LIMIT;

  const queries = useQueries({
    queries:
      playlist && savedTracks
        ? Array.from({ length: Math.ceil(playlist.trackCount / limit) }, (_, i) => {
            const offset = i * limit;

            const queryOptions: UseQueryOptions<
              SpotifyApi.PlaylistTrackResponse,
              unknown,
              Track[]
            > = {
              queryKey: ['playlistTracks', playlistId, { limit, offset }],
              queryFn: () => spotifyApi.fetchPlaylistTracks(playlistId, { limit, offset }),
              select: data =>
                data.items.reduce<Track[]>((acc, track) => {
                  if (!track.track) return acc;

                  const isSaved = savedTracks.some(savedTrack => savedTrack.id === track.track?.id);

                  return [...acc, trackDto(track.track, track.added_at, isSaved)];
                }, []),
              staleTime: playlist.stale ? Infinity : 60 * 1000,
            };

            return queryOptions;
          })
        : [],
  });

  const isLoading = queries.some(query => query.status === 'loading') || fetchingSavedTracks;

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
