import { usePlaylistTracks } from '@src/hooks/usePlaylistTracks';
import { useTracksAudioFeatures } from '@src/hooks/useTracksAudioFeatures';
import { Playlist, TrackWithAudioFeatures } from '@src/types';
import { getSortedTrackIds } from '@src/utils';

type UsePlaylistTracksWithAudioFeaturesResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: TrackWithAudioFeatures[];
      isLoading: false;
    };

export const usePlaylistTracksWithAudioFeatures = (
  playlist: Playlist,
): UsePlaylistTracksWithAudioFeaturesResult => {
  const { data: tracks } = usePlaylistTracks(playlist);
  const { data: audioFeatures } = useTracksAudioFeatures(tracks ? getSortedTrackIds(tracks) : []);

  if (!tracks || !audioFeatures) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  return {
    data: tracks.map(track => ({
      ...track,
      audioFeatures: audioFeatures?.find(({ id }) => track.id === id),
    })),
    isLoading: false,
  };
};
