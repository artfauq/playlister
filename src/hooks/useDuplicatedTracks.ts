import { usePlaylistsTracks } from '@src/hooks/usePlaylistsTracks';
import { usePlaylistTracks } from '@src/hooks/usePlaylistTracks';
import { DuplicateReason, Track } from '@src/types';
import { getTrackNameAndArtist } from '@src/utils';

export type DuplicateTracksData = Record<
  string,
  Array<{
    sourceTrack: Track;
    targetTrack: Track;
    duplicateReason: DuplicateReason;
  }>
>;

export type UseDuplicatedTracksResult =
  | {
      data: undefined;
      isLoading: true;
    }
  | {
      data: DuplicateTracksData;
      isLoading: false;
    };

export function useDuplicatedTracks(
  sourcePlaylistId: string,
  targetPlaylistIds: string[],
): UseDuplicatedTracksResult {
  const { data: sourcePlaylistTracks } = usePlaylistTracks(sourcePlaylistId);
  const { data: tracksByPlaylistId } = usePlaylistsTracks(
    targetPlaylistIds.filter(id => id !== sourcePlaylistId),
  );

  if (!sourcePlaylistTracks || !tracksByPlaylistId) {
    return {
      data: undefined,
      isLoading: true,
    };
  }

  const targetPlaylistsTracks = [...tracksByPlaylistId.entries()]
    .map(([playlistId, tracks]) => tracks.map(track => ({ ...track, playlistId })))
    .flat();

  const duplicateTracks: Record<
    string,
    Array<{
      sourceTrack: Track;
      targetTrack: Track;
      duplicateReason: DuplicateReason;
    }>
  > = {};

  sourcePlaylistTracks.forEach(sourceTrack => {
    const sourceTrackUri = sourceTrack.uri;
    const sourceTrackISRC = sourceTrack.isrc;
    const sourceTrackNameAndArtist = getTrackNameAndArtist(sourceTrack);

    targetPlaylistsTracks.forEach(targetTrack => {
      const targetTrackUri = targetTrack.uri;
      const targetTrackISRC = targetTrack.isrc;
      const targetTrackNameAndArtist = getTrackNameAndArtist(targetTrack);

      let duplicateReason: DuplicateReason | undefined;

      if (targetTrackUri === sourceTrackUri) {
        duplicateReason = DuplicateReason.SameUri;
      } else if (targetTrackISRC === sourceTrackISRC) {
        duplicateReason = DuplicateReason.SameISRC;
      } else if (targetTrackNameAndArtist === sourceTrackNameAndArtist) {
        duplicateReason = DuplicateReason.SameArtistAndName;
      }

      if (duplicateReason) {
        duplicateTracks[targetTrack.playlistId] = (
          duplicateTracks[targetTrack.playlistId] ?? []
        ).concat({ sourceTrack, targetTrack, duplicateReason });
      }
    });
  });

  return {
    data: duplicateTracks,
    isLoading: false,
  };
}
