import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { spotifyApi } from '@src/lib';
import { authenticatedHandler } from '@src/utils';

export type SaveUnclassifiedResponse = {
  toAddTracks: SpotifyApi.SavedTrackObject[];
  toRemoveTracks: SpotifyApi.PlaylistTrackObject[];
};

export default authenticatedHandler<SaveUnclassifiedResponse>(async (req, res) => {
  const playlists = await spotifyApi.fetchPaginatedData<SpotifyApi.PlaylistObjectSimplified>({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      Authorization: `Bearer ${req.session.accessToken}`,
    },
    params: {
      limit: 50,
    },
  });

  const unclassifiedPlaylist = playlists.find(
    playlist => playlist.name === UNCLASSIFIED_PLAYLIST_NAME,
  );

  if (!unclassifiedPlaylist) {
    res.status(400);
    return;
  }

  const savedTracks = await spotifyApi.fetchPaginatedData<SpotifyApi.SavedTrackObject>({
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: {
      Authorization: `Bearer ${req.session.accessToken}`,
    },
    params: {
      limit: 50,
    },
  });

  const { allPlaylistsTracks, unclassifiedPlaylistTracks } = await Promise.all(
    playlists.map(playlist =>
      spotifyApi.fetchPaginatedData<SpotifyApi.PlaylistTrackObject>({
        url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
        },
      }),
    ),
  ).then(tracks => {
    return tracks.reduce(
      (acc, playlistTracks, index) => {
        if (playlists[index].id === unclassifiedPlaylist.id) {
          acc.unclassifiedPlaylistTracks.push(...playlistTracks);
        } else {
          acc.allPlaylistsTracks.push(...playlistTracks);
        }

        return acc;
      },
      {
        allPlaylistsTracks: [] as SpotifyApi.PlaylistTrackObject[],
        unclassifiedPlaylistTracks: [] as SpotifyApi.PlaylistTrackObject[],
      },
    );
  });

  const unclassifiedTracks = savedTracks.filter(
    track => !allPlaylistsTracks.find(playlistTrack => playlistTrack.track?.id === track.track.id),
  );

  const toAddTracks = unclassifiedTracks.filter(
    track =>
      !unclassifiedPlaylistTracks.find(
        unclassifiedTrack => unclassifiedTrack.track?.id === track.track.id,
      ),
  );

  const toRemoveTracks = unclassifiedPlaylistTracks.filter(
    unclassifiedTrack =>
      !unclassifiedTracks.find(track => track.track.id === unclassifiedTrack.track?.id),
  );

  res.status(200).json({ toAddTracks, toRemoveTracks });
});
