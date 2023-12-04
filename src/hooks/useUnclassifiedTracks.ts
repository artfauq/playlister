import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { usePlaylistsTracks, useSavedTracks } from '@src/hooks';
import { usePlaylists } from '@src/modules/playlists';
import { Track } from '@src/types';
import { mapObjectsByKey } from '@src/utils';

type UseUnclassifiedTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: Track[];
      isLoading: false;
    };

export const useUnclassifiedTracks = (): UseUnclassifiedTracksResult => {
  const playlists = usePlaylists(true).filter(
    playlist => playlist.name !== UNCLASSIFIED_PLAYLIST_NAME,
  );
  const { data: tracksByPlaylistId } = usePlaylistsTracks(mapObjectsByKey(playlists, 'id'));
  const { data: savedTracks } = useSavedTracks();

  if (!savedTracks || !tracksByPlaylistId) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  const playlistsTracks = [...tracksByPlaylistId.entries()]
    .map(([playlistId, tracks]) => tracks.map(track => ({ ...track, playlistId })))
    .flat();

  const unclassifiedTracks = savedTracks.filter(
    track => !playlistsTracks.find(playlistTrack => playlistTrack.id === track.id),
  );

  return {
    data: unclassifiedTracks,
    isLoading: false,
  };
};
