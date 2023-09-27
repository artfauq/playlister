import { useMemo } from 'react';

import { DuplicateTrack } from '@src/types';
import { findDuplicateTracks } from '@src/utils';

import { usePlaylistTracks } from './usePlaylistTracks';

type UseDuplicatedTracksResult =
  | {
      data: DuplicateTrack[];
      fetching: false;
    }
  | {
      data: undefined;
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
      data: undefined,
      fetching: true,
    };
  }

  return {
    data: duplicatedTracks,
    fetching: false,
  };
};
