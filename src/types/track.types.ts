export type Track = {
  id: string;
  album: SpotifyApi.AlbumObjectSimplified;
  artists: SpotifyApi.ArtistObjectSimplified[];
  durationMs: number;
  isLocal: boolean | null;
  isrc: string | null;
  isSaved: boolean;
  linkedFrom: {
    uri: string;
  } | null;
  name: string;
  uri: string;
};

export type TrackWithAudioFeatures = Track & {
  audioFeatures?: SpotifyApi.AudioFeaturesObject;
};

export type DuplicateTrack = Track & {
  duplicateReason: 'sameUri' | 'sameISRC' | 'sameArtistAndName';
};
