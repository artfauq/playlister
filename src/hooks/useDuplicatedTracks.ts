import { useMemo } from 'react';

import { DuplicateTrack, Playlist } from '@src/types';
import { findDuplicateTracks } from '@src/utils';

import { usePlaylistTracks } from './usePlaylistTracks';

type UseDuplicatedTracksResult =
  | {
      duplicatedTracks: DuplicateTrack[];
      fetching: false;
    }
  | {
      duplicatedTracks: undefined;
      fetching: true;
    };

export const useDuplicatedTracks = (playlist: Playlist): UseDuplicatedTracksResult => {
  const { data: playlistTracks } = usePlaylistTracks(playlist);

  const duplicatedTracks = useMemo(() => {
    if (!playlistTracks) return undefined;

    return findDuplicateTracks(playlistTracks);
  }, [playlistTracks]);

  if (!duplicatedTracks) {
    return {
      duplicatedTracks: undefined,
      fetching: true,
    };
  }

  return {
    duplicatedTracks,
    fetching: false,
  };
};
