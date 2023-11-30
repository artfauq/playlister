import { useQuery } from '@tanstack/react-query';

import { usePlaylist } from '@src/hooks/usePlaylist';
import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { trackDto } from '@src/utils';

type UsePlaylistTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Track[];
      isLoading: false;
    };

export const usePlaylistTracks = (playlistId?: string) => {
  const { data: playlist } = usePlaylist(playlistId);

  return useQuery({
    enabled: !!playlistId,
    queryKey: ['playlists', playlistId, 'tracks'],
    queryFn: async () => spotifyApi.fetchPlaylistTracks(playlistId!),
    select: (data: SpotifyApi.PlaylistTrackObject[] | undefined) => {
      if (!data) return data;

      return data.reduce(
        (acc, track) => (track.track ? [...acc, trackDto(track.track, playlistId!)] : acc),
        [] as Track[],
      );

      // const tracks = data.items.filter(item => !!item.track).map(track => track.track!)
      // const trackIds = tracks.map(track => track.id);
      // const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);
    },
    staleTime: 0,
  });

  // const limit = SPOTIFY_PLAYLIST_TRACKS_MAX_LIMIT;
  // const queries = useQueries({
  //   queries: playlist
  //     ? Array.from({ length: Math.ceil(playlist.trackCount / limit) }, (_, i) => {
  //         const offset = i * limit;

  //         const queryOptions = {
  //           enabled: !!playlistId,
  //           queryKey: ['playlists', playlistId, 'tracks', { offset, limit }],
  //           queryFn: async () => {
  //             return spotifyApi.fetchPlaylistTracks(playlistId!, { offset, limit });
  //             // .then(tracks =>
  //             //   tracks.items.filter(item => !!item.track).map(track => track.track!),
  //             // );

  //             // console.log('playlistTracks', playlistTracks);

  //             // const trackIds = playlistTracks.map(track => track.id);
  //             // const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);

  //             // return playlistTracks.reduce<Track[]>((acc, track, index) => {
  //             //   const isSaved = savedTracksIndices[index];

  //             //   return [...acc, trackDto(track, isSaved)];
  //             // }, []);
  //           },
  //           select: (data: SpotifyApi.PlaylistTrackResponse | undefined) => {
  //             if (!data) return data;

  //             return data.items.reduce(
  //               (acc, track) => (track.track ? [...acc, trackDto(track.track, playlistId!)] : acc),
  //               [] as Track[],
  //             );

  //             // const tracks = data.items.filter(item => !!item.track).map(track => track.track!)
  //             // const trackIds = tracks.map(track => track.id);
  //             // const savedTracksIndices = await spotifyApi.checkUserSavedTracks(trackIds);
  //           },
  //           staleTime: 0,
  //         };

  //         return queryOptions;
  //       })
  //     : [],
  // });

  // const isLoading = queries.some(query => query.status === 'loading');

  // if (isLoading) {
  //   return {
  //     data: undefined,
  //     isLoading: true,
  //   };
  // }

  // const data = queries.reduce<Track[]>(
  //   (acc, query) => (query.data ? [...acc, ...query.data] : acc),
  //   [],
  // );

  // return {
  //   data,
  //   isLoading: false,
  // };
};
