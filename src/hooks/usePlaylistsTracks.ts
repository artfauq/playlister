import { useQueries } from '@tanstack/react-query';
import ms from 'ms';

import { queryKeys } from '@src/config';
import { spotifyApi } from '@src/lib';
import { usePlaylists } from '@src/modules/playlists';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

type UsePlaylistsTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Map<string, Track[]>;
      isLoading: false;
    };

export const usePlaylistsTracks = (playlistIds: string[]): UsePlaylistsTracksResult => {
  const playlists = usePlaylists();

  // const limit = SPOTIFY_PLAYLIST_TRACKS_MAX_LIMIT;
  const queries = playlists
    .filter(p => playlistIds.includes(p.id))
    .map(playlist => {
      // const chunks = Math.ceil(playlist.trackCount / limit);

      // return Array.from({ length: chunks }, (_, i) => {
      //   // const offset = i * limit;

      //   const queryOptions = {
      //     queryKey: queryKeys.playlists.tracks(playlist.id).queryKey,
      //     queryFn: async () => spotifyApi.fetchPlaylistTracks(playlist.id),
      //     select: (data: SpotifyApi.PlaylistTrackObject[] | undefined) => {
      //       if (!data) return data;

      //       return data.reduce(
      //         (acc, track) => (track.track ? [...acc, trackDto(track.track, playlist.id)] : acc),
      //         [] as Track[],
      //       );
      //     },
      //     staleTime: 0,
      //   };

      //   return queryOptions;
      // });
      const queryOptions = {
        queryKey: queryKeys.playlists.tracks(playlist.id).queryKey,
        queryFn: async () => spotifyApi.fetchPlaylistTracks(playlist.id),
        select: (data: SpotifyApi.PlaylistTrackObject[] | undefined) => {
          if (!data) return data;

          return data.reduce(
            (acc, track) => (track.track ? [...acc, trackDto(track.track, playlist.id)] : acc),
            [] as Track[],
          );
        },
        staleTime: ms('15m'),
      };

      return queryOptions;
    })
    .flat();

  const queriesResult = useQueries({ queries });

  const isLoading = queriesResult.some(query => query.status === 'loading');

  if (isLoading) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  const data = queriesResult.reduce((acc, query) => {
    if (!query.data) return acc;

    const tracks = query.data;

    tracks.forEach(track => {
      const { playlistId } = track;

      if (!playlistId) return;

      acc.set(playlistId, [...(acc.get(playlistId) ?? []), track]);
    });

    return acc;
  }, new Map<string, Track[]>());

  return {
    data,
    isLoading: false,
  };
};
