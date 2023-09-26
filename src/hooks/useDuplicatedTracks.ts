import { useMemo } from 'react';

import { DuplicateTrack } from '@src/types';
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

export const useDuplicatedTracks = (playlistId: string): UseDuplicatedTracksResult => {
  const { data: playlistTracks } = usePlaylistTracks(playlistId);

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
