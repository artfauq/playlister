import { REMASTERED_TRACK_REGEX } from '@src/constants';
import { DuplicateReason, DuplicateTrack, Track, TrackWithAudioFeatures } from '@src/types';

export const trackDto = (
  track: SpotifyApi.TrackObjectFull,
  playlistId: string | null,
  isSaved?: boolean,
): Readonly<Track> => {
  return {
    id: track.id,
    album: track.album,
    artists: track.artists,
    durationMs: track.duration_ms,
    isLocal: track.is_local ?? null,
    isrc: track.external_ids?.isrc ?? null,
    isSaved,
    linkedFrom: track.linked_from ?? null,
    name: track.name,
    playlistId,
    uri: track.uri,
  };
};

export const getFormattedTrackName = (track: Track) =>
  track.name.replace(REMASTERED_TRACK_REGEX, '$1').trim();

export const getTrackNameAndArtist = (track: Track) =>
  `${getFormattedTrackName(track)} - ${track.artists[0].name.toLowerCase()}`;

export const parseTrackDuration = (durationMs: number) => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);

  return `${minutes}:${seconds.padStart(2, '0')}`;
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

export const findDuplicateTracks = <T extends Track>(tracks: T[]): Array<DuplicateTrack<T>> => {
  const duplicateTracks: Array<DuplicateTrack<T>> = [];

  const trackUris = new Set<string>();
  const trackISRCs = new Set<string>();
  const trackNamesAndArtists = new Set<string>();

  tracks
    // .filter(track => !track.isLocal)
    .forEach(track => {
      const trackUri = track.uri;
      const trackISRC = track.isrc;
      const trackName = getFormattedTrackName(track);
      const trackArtist = getTrackNameAndArtist(track);
      const trackNameAndArtist = `${trackName} - ${trackArtist}`;

      let duplicateReason: DuplicateReason | undefined;

      if (trackUris.has(trackUri)) {
        duplicateReason = DuplicateReason.SameUri;
      } else if (trackISRC && trackISRCs.has(trackISRC)) {
        duplicateReason = DuplicateReason.SameISRC;
      } else if (trackNamesAndArtists.has(trackNameAndArtist)) {
        duplicateReason = DuplicateReason.SameArtistAndName;
      }

      if (duplicateReason) {
        duplicateTracks.push({ track, duplicateReason });
      } else {
        trackUris.add(trackUri);
        trackNamesAndArtists.add(trackNameAndArtist);

        if (trackISRC) {
          trackISRCs.add(trackISRC);
        }
      }
    });

  return duplicateTracks;
};
