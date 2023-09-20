import { REMASTERED_TRACK_REGEX } from '@src/lib/constants';
import { DuplicateTrack, Track, TrackWithAudioFeatures } from '@src/types';

export const parseTrackDuration = (durationMs: number) => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);

  return `${minutes}:${seconds.padStart(2, '0')}`;
};

export const sortTracksByName = <TData extends Track>(tracks: TData[]) => {
  return tracks.sort((a, b) => a.name.localeCompare(b.name));
};

export const getSortedTrackIds = (tracks: Track[]) => {
  return [...tracks.map(track => track.id)].sort();
};

export const getTrackBpm = (track: TrackWithAudioFeatures) => {
  return Math.round(track.audioFeatures?.tempo ?? 0);
};

export const getHighestBpmTrack = (tracks: TrackWithAudioFeatures[]) => {
  return tracks.reduce((highestBpmTrack, track) => {
    const bpm = getTrackBpm(track);
    const highestBpm = getTrackBpm(highestBpmTrack);

    return bpm > highestBpm ? track : highestBpmTrack;
  }, tracks[0]);
};

export const getLowestBpmTrack = (tracks: TrackWithAudioFeatures[]) => {
  return tracks.reduce((lowestBpmTrack, track) => {
    const bpm = getTrackBpm(track);
    const lowestBpm = getTrackBpm(lowestBpmTrack);

    return bpm < lowestBpm ? track : lowestBpmTrack;
  }, tracks[0]);
};

export const getTracksAverageBpm = (tracks: TrackWithAudioFeatures[]) => {
  return Math.round(tracks.reduce((acc, track) => acc + getTrackBpm(track), 0) / tracks.length);
};

export const findDuplicateTracks = (tracks: Track[]): DuplicateTrack[] => {
  const duplicateTracks: DuplicateTrack[] = [];

  const trackUris = new Set<string>();
  const trackISRCs = new Set<string>();
  const trackNamesAndArtists = new Set<string>();

  tracks
    .filter(track => !track.is_local)
    .forEach(track => {
      const trackUri = track.uri;
      const trackISRC = track.external_ids?.isrc;
      const trackName = track.name.replace(REMASTERED_TRACK_REGEX, '$1').trim();
      const trackArtist = track.artists[0].name.toLowerCase();
      const trackNameAndArtist = `${trackName} - ${trackArtist}`;

      if (trackUris.has(trackUri)) {
        duplicateTracks.push({
          ...track,
          duplicateReason: 'sameUri',
        });

        return;
      }

      trackUris.add(trackUri);

      if (trackISRC) {
        if (trackISRCs.has(trackISRC)) {
          duplicateTracks.push({
            ...track,
            duplicateReason: 'sameISRC',
          });

          return;
        }

        trackISRCs.add(trackISRC);
      }

      if (trackNamesAndArtists.has(trackNameAndArtist)) {
        duplicateTracks.push({
          ...track,
          duplicateReason: 'sameArtistAndName',
        });
      } else {
        trackNamesAndArtists.add(trackNameAndArtist);
      }
    });

  console.log('duplicateTracks', duplicateTracks);

  return duplicateTracks;
};
