import { getPlaylistTracks, getUserPlaylists, removePlaylistTracks } from './helpers';

const CLEAN_PLAYLIST = '';
const SEARCH_PLAYLISTS: string[] = [];

(async () => {
  // Retrieve all user's playlists
  const playlists = await getUserPlaylists();

  console.log(`\nRetrieved ${playlists.length} playlists`);

  const toCleanPlaylist = playlists.find(playlist => playlist.name === CLEAN_PLAYLIST);
  const searchPlaylists = playlists.filter(
    playlist =>
      playlist.name !== CLEAN_PLAYLIST &&
      (SEARCH_PLAYLISTS.length === 0 || SEARCH_PLAYLISTS.includes(playlist.name)),
  );

  if (!toCleanPlaylist) {
    throw new Error('\nPlaylist not found !');
  }

  const playlistTracks = await getPlaylistTracks(toCleanPlaylist.tracks.href);

  console.log(`\nFound ${playlistTracks.length} songs in playlist ${CLEAN_PLAYLIST}`);

  const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
    ...(await Promise.all(
      searchPlaylists.map(playlist => getPlaylistTracks(playlist.tracks.href)),
    )),
  );

  console.log(
    `\nFound ${searchTracks.length} songs in playlists: ${searchPlaylists
      .map(playlist => playlist.name)
      .join(', ')}`,
  );

  const toDeleteTracks = playlistTracks
    .filter(
      ({ track: t1 }) =>
        !t1.is_local &&
        searchTracks.find(
          ({ track: t2 }) =>
            t1.uri === t2.uri ||
            (t1.name.toLowerCase() === t2.name.toLowerCase() &&
              t1.artists.map(artist => artist.name).join(',') ===
                t2.artists.map(artist => artist.name).join(',')),
        ),
    )
    .map(({ track }) => track);

  if (toDeleteTracks.length === 0) {
    console.log('\nNo tracks to remove !');

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

  console.log(`\nSuccessfully removed ${toDeleteTracks.length} songs:`);

  toDeleteTracks.forEach(track => {
    console.log(`- ${track.artists.map(artist => artist.name).join(' + ')} - ${track.name}`);
  });

  process.exit(0);
})().catch(err => {
  console.error(err);

  process.exit(1);
});
