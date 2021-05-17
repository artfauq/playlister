import { getPlaylistTracks, getUserPlaylists, removePlaylistTracks } from './helpers';

const CLEAN_PLAYLIST = 'TRI';
const SEARCH_PLAYLIST = ['FF I', 'FF II', 'FF III'];

(async () => {
  // Retrieve all user's playlists
  const playlists = await getUserPlaylists();

  const toCleanPlaylist = playlists.find(playlist => playlist.name === CLEAN_PLAYLIST);
  const searchPlaylists = playlists.filter(playlist => SEARCH_PLAYLIST.includes(playlist.name));

  if (!toCleanPlaylist) {
    throw new Error('Playlist not found !');
  }

  const playlistTracks = await getPlaylistTracks(toCleanPlaylist.tracks.href);

  const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
    ...(await Promise.all(
      searchPlaylists.map(playlist => getPlaylistTracks(playlist.tracks.href)),
    )),
  );

  const toDeleteTracks = playlistTracks
    .filter(
      ({ track }) =>
        !track.is_local &&
        (!track.is_playable ||
          searchTracks.find(
            ({ track: t }) =>
              t.uri === track.uri ||
              (t.uri !== track.uri &&
                t.name.toLowerCase() === track.name.toLowerCase() &&
                t.artists.map(artist => artist.name).join(' + ') ===
                  track.artists.map(artist => artist.name).join(' + ') &&
                t.duration_ms === track.duration_ms),
          )),
    )
    .map(({ track }) => track);

  if (toDeleteTracks.length === 0) {
    console.log('No tracks to remove !');

    return;
  }

  // Remove tracks by chunks of 100
  await Promise.all(
    Array(Math.ceil(toDeleteTracks.length / 100))
      .fill(null)
      .map((_, index) => index * 100)
      .map(begin => toDeleteTracks.slice(begin, begin + 100))
      .map(chunk => removePlaylistTracks(toCleanPlaylist.id, chunk)),
  );

  console.log('Successfully removed the following songs:');

  toDeleteTracks.forEach(track => {
    console.log(`- ${track.artists.map(artist => artist.name).join(' + ')} - ${track.name}`);
  });
})().catch(err => {
  console.error(err);

  process.exit(1);
});
