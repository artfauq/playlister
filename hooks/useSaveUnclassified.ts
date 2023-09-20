import { useMutation } from '@tanstack/react-query';

import { addTracksToPlaylist, removeTracksFromPlaylist } from '@src/lib/spotify-api';
import { Track } from '@src/types';

import { usePlaylistTracks } from './usePlaylistTracks';

export const useSaveUnclassified = (unclassifiedPlaylistId: string, removeClassified = true) => {
  const { data: unclassifiedPlaylistTracks } = usePlaylistTracks(unclassifiedPlaylistId);

  const { mutate: saveUnclassified, status } = useMutation({
    mutationFn: async (unclassifiedTracks: Track[]) => {
      if (!unclassifiedPlaylistTracks) return undefined;

      const toAddTracks = unclassifiedTracks.filter(
        track =>
          !unclassifiedPlaylistTracks.find(unclassifiedTrack => unclassifiedTrack.id === track.id),
      );

      const toRemoveTracks = unclassifiedPlaylistTracks.filter(
        unclassifiedTrack => !unclassifiedTracks.find(track => track.id === unclassifiedTrack.id),
      );

      if (toRemoveTracks.length && removeClassified) {
        await removeTracksFromPlaylist(unclassifiedPlaylistId, toRemoveTracks);
      }

      if (toAddTracks.length) {
        await addTracksToPlaylist(unclassifiedPlaylistId, toAddTracks);
      }

      return {
        addedTracks: toAddTracks,
        removedTracks: removeClassified ? toRemoveTracks : [],
      };
    },
  });

  return { saveUnclassified, status };
};