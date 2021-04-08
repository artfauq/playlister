import { getPlaylistTracks, getUserPlaylists, removePlaylistTracks } from './helpers';

(async () => {
  // Retrieve all user's playlists
  const playlists = await getUserPlaylists();

  const discoveryPlaylist = playlists.find(playlist => playlist.name === 'Discovery');
  const greatMixPlaylist = playlists.find(playlist => playlist.name === 'Great Mix');
  const heatUpPlaylist = playlists.find(playlist => playlist.name === 'Heat Up');
  const popComPlaylist = playlists.find(playlist => playlist.name === "Pop Com'");

  if (!discoveryPlaylist || !greatMixPlaylist || !heatUpPlaylist || !popComPlaylist) {
    throw new Error('Playlist not found !');
  }

  const toDeleteTracks: Array<SpotifyApi.TrackObjectFull> = [];
  const discoveryPlaylistTracks = await getPlaylistTracks(discoveryPlaylist.tracks.href);
  const greatMixPlaylistTracks = await getPlaylistTracks(greatMixPlaylist.tracks.href);
  const heatUpPlaylistTracks = await getPlaylistTracks(heatUpPlaylist.tracks.href);
  const popComPlaylistTracks = await getPlaylistTracks(popComPlaylist.tracks.href);

  discoveryPlaylistTracks.forEach(({ track }) => {
    if (track.is_local) {
      return;
    }

    if (
      !track.is_playable ||
      greatMixPlaylistTracks.find(({ track: t }) => t.uri === track.uri) ||
      heatUpPlaylistTracks.find(({ track: t }) => t.uri === track.uri) ||
      popComPlaylistTracks.find(({ track: t }) => t.uri === track.uri) ||
      discoveryPlaylistTracks.find(
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

  await removePlaylistTracks(discoveryPlaylist.id, toDeleteTracks);
})().catch(err => {
  console.error(err);

  process.exit(1);
});
