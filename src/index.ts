import { getPlaylistTracks, getUserPlaylists, removePlaylistTracks } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // Retrieve all user's playlists
  const playlists = await getUserPlaylists();

  const discoveryPlaylist = playlists.find(playlist => playlist.name === 'Discovery');
  const greatMixPlaylist = playlists.find(playlist => playlist.name === 'Great Mix');
  const heatUpPlaylist = playlists.find(playlist => playlist.name === 'Heat Up');

  if (!discoveryPlaylist || !greatMixPlaylist || !heatUpPlaylist) {
    return;
  }

  const toDeleteTracks: Array<SpotifyApi.TrackObjectFull> = [];
  const discoveryPlaylistTracks = await getPlaylistTracks(discoveryPlaylist.tracks.href);
  const greatMixPlaylistTracks = await getPlaylistTracks(greatMixPlaylist.tracks.href);
  const heatUpPlaylistTracks = await getPlaylistTracks(heatUpPlaylist.tracks.href);

  discoveryPlaylistTracks.forEach(({ track }) => {
    if (
      !track.is_local &&
      (!track.is_playable ||
        greatMixPlaylistTracks.find(({ track: t }) => t.uri === track.uri) ||
        heatUpPlaylistTracks.find(({ track: t }) => t.uri === track.uri))
    ) {
      toDeleteTracks.push(track);
    }
  });

  await removePlaylistTracks(discoveryPlaylist.id, toDeleteTracks);
})();
