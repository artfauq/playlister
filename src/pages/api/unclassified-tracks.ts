import { UNCLASSIFIED_PLAYLIST_NAME } from '@src/constants';
import { spotifyApi } from '@src/lib';
import { CreatePlaylistInput } from '@src/types';
import { authenticatedHandler } from '@src/utils';

const createUnclassifiedPlaylist = (userId: string) => {
  return spotifyApi.apiRequest<SpotifyApi.CreatePlaylistResponse>({
    method: 'POST',
    url: `/users/${userId}/playlists`,
    data: JSON.stringify({
      collaborative: false,
      description:
        'A collection of your saved tracks that are not already in one of your playlists',
      name: UNCLASSIFIED_PLAYLIST_NAME,
      public: false,
    } as CreatePlaylistInput),
  });
};

export default authenticatedHandler<SpotifyApi.SavedTrackObject[]>(async (req, res) => {
  const { user } = req.session;

  const otherPlaylists = await spotifyApi
    .fetchPaginatedData<SpotifyApi.PlaylistObjectSimplified>({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
      params: {
        limit: 50,
      },
    })
    .then(data =>
      data.filter(
        playlist => playlist.owner.id === user.id && playlist.name !== UNCLASSIFIED_PLAYLIST_NAME,
      ),
    );

  const savedTracks = await spotifyApi.fetchPaginatedData<SpotifyApi.SavedTrackObject>({
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: {
      Authorization: `Bearer ${req.session.accessToken}`,
    },
    params: {
      limit: 50,
    },
  });

  const playlistsTracks = await Promise.all(
    otherPlaylists.map(playlist =>
      spotifyApi.fetchPaginatedData<SpotifyApi.PlaylistTrackObject>({
        url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
        },
      }),
    ),
  ).then(tracks => tracks.reduce((acc, playlistTracks) => [...acc, ...playlistTracks], []));

  const unclassifiedTracks = savedTracks.filter(
    track => !playlistsTracks.find(playlistTrack => playlistTrack.track?.id === track.track.id),
  );

  res.status(200).json(unclassifiedTracks);
});
