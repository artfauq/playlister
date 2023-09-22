import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { usePlaylists, useSavedTracks } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';

type UseUnclassifiedTracksResult =
  | {
      unclassifiedTracks: Track[];
      fetching: false;
    }
  | {
      unclassifiedTracks: undefined;
      fetching: true;
    };

export const useUnclassifiedTracks = (
  unclassifiedPlaylistId: string,
): UseUnclassifiedTracksResult => {
  const { data: playlists } = usePlaylists();
  const { data: savedTracks } = useSavedTracks();
  const playlistQueries = useQueries({
    queries: (playlists ?? [])
      .filter(playlist => playlist.id !== unclassifiedPlaylistId)
      .map(playlist => ({
        queryKey: ['playlistTracks', playlist.id],
        queryFn: () => spotifyApi.fetchPlaylistTracks(playlist.id),
      })),
  });

  const unclassifiedTracks = useMemo(() => {
    if (!savedTracks || playlistQueries.some(query => query.status !== 'success')) return undefined;

    const allPlaylistTracks = playlistQueries.reduce<Track[]>((acc, query) => {
      if (query.status !== 'success') return acc;

      return [...acc, ...query.data];
    }, []);

    return savedTracks.filter(
      track => !allPlaylistTracks.find(playlistTrack => playlistTrack.id === track.id),
    );
  }, [savedTracks, playlistQueries]);

  if (!unclassifiedTracks) {
    return {
      unclassifiedTracks: undefined,
      fetching: true,
    };
  }

  return {
    unclassifiedTracks,
    fetching: false,
  };
};
