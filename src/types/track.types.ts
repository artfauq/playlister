export type Track = {
  id: string;
  addedAt: string;
  album: SpotifyApi.AlbumObjectSimplified;
  artists: SpotifyApi.ArtistObjectSimplified[];
  durationMs: number;
  isLocal?: boolean;
  isrc?: string;
  linkedFrom?: {
    uri: string;
  };
  name: string;
  uri: string;
};

export type TrackWithAudioFeatures = Track & {
  audioFeatures?: SpotifyApi.AudioFeaturesObject;
};

export type DuplicateTrack = Track & {
  duplicateReason: 'sameUri' | 'sameISRC' | 'sameArtistAndName';
};
