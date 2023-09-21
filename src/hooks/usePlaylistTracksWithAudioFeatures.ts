import { usePlaylistTracks } from '@src/hooks/usePlaylistTracks';
import { useTracksAudioFeatures } from '@src/hooks/useTracksAudioFeatures';
import { TrackWithAudioFeatures } from '@src/types';
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
  playlistId: string,
): UsePlaylistTracksWithAudioFeaturesResult => {
  const { data: tracks } = usePlaylistTracks(playlistId);
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
