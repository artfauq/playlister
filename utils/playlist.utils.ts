export const sortPlaylistsByName = <TData extends SpotifyApi.PlaylistBaseObject>(
  playlists: TData[],
) => {
  return playlists.sort((a, b) => a.name.localeCompare(b.name));
};
