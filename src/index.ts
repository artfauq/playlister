import { getPlaylistTracks, getUserPlaylists, removePlaylistTracks } from './helpers';

(async () => {
  // Retrieve all user's playlists
  const playlists = await getUserPlaylists();

  const toCleanPlaylist = playlists.find(playlist => playlist.name === 'Discovery');
  const searchPlaylists = playlists.filter(playlist => ['FF I', 'FF II'].includes(playlist.name));

  if (!toCleanPlaylist) {
    throw new Error('Playlist not found !');
  }

  const toDeleteTracks: Array<SpotifyApi.TrackObjectFull> = [];
  const playlistTracks = await getPlaylistTracks(toCleanPlaylist.tracks.href);

  const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
    ...(await Promise.all(
      searchPlaylists.map(playlist => getPlaylistTracks(playlist.tracks.href)),
    )),
  );

  playlistTracks.forEach(({ track }) => {
    if (track.is_local) {
      return;
    }

    if (
      !track.is_playable ||
      searchTracks.find(({ track: t }) => t.uri === track.uri) ||
      playlistTracks.find(
        ({ track: t }) =>
          t.uri !== track.uri &&
          t.name.toLowerCase() === track.name.toLowerCase() &&
          t.artists.map(artist => artist.name).join(' + ') ===
            track.artists.map(artist => artist.name).join(' + ') &&
          t.duration_ms === track.duration_ms,
      )
    ) {
      toDeleteTracks.push(track);
    }
  });

  await removePlaylistTracks(toCleanPlaylist.id, toDeleteTracks);
})().catch(err => {
  console.error(err);

  process.exit(1);
});
