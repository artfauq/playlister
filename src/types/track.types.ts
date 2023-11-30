export type Track = {
  id: string;
  album: SpotifyApi.AlbumObjectSimplified;
  artists: SpotifyApi.ArtistObjectSimplified[];
  durationMs: number;
  isLocal: boolean | null;
  isrc: string | null;
  isSaved?: boolean;
  linkedFrom: {
    uri: string;
  } | null;
  name: string;
  playlistId: string | null;
  uri: string;
};

export type TrackWithAudioFeatures = Track & {
  audioFeatures?: SpotifyApi.AudioFeaturesObject;
};

export type DuplicateTrack<T extends Track> = {
  track: T;
  duplicateReason: 'sameUri' | 'sameISRC' | 'sameArtistAndName';
};

export enum DuplicateReason {
  SameUri = 'sameUri',
  SameISRC = 'sameISRC',
  SameArtistAndName = 'sameArtistAndName',
}
