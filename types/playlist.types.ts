export type Playlist = SpotifyApi.PlaylistObjectSimplified;

export type CreatePlaylistInput = {
  name: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
};
