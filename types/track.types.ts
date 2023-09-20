export type Track = SpotifyApi.TrackObjectFull;

export type TrackWithAudioFeatures = Track & {
  audioFeatures?: SpotifyApi.AudioFeaturesObject;
};

export type DuplicateTrack = Track & {
  duplicateReason: 'sameUri' | 'sameISRC' | 'sameArtistAndName';
};
