import axios, { AxiosError } from 'axios';
import config from '../config';

// Initialize axios instance
const api = axios.create({
  baseURL: config.spotifyApi.baseUrl,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${config.spotifyApi.token}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Returns all the playlists of the user.
 */
export const getUserPlaylists = async (): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> => {
  const { data } = await api.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>('/me/playlists', {
    params: { limit: 50 },
  });

  return data.items;
};

/**
 * Returns all the tracks of a playlist.
 */
export const getPlaylistTracks = async (
  href: string,
  acc: Array<SpotifyApi.PlaylistTrackObject> = [],
): Promise<Array<SpotifyApi.PlaylistTrackObject>> => {
  const { data } = await api.get<SpotifyApi.PlaylistTrackResponse>(href, {
    params: { limit: 100, market: 'FR' },
  });

  // Retrieve tracks from response and sort them by name
  const tracks = [...acc, ...data.items].sort(({ track: trackA }, { track: trackB }) =>
    trackA.name.localeCompare(trackB.name),
  );

  return data.next ? getPlaylistTracks(data.next, tracks) : tracks;
};

/**
 * Returns all the tracks of a playlist.
 */
export const removePlaylistTracks = async (
  playlistId: string,
  tracks: Array<SpotifyApi.TrackObjectFull> = [],
): Promise<void> => {
  const requestData = {
    tracks: tracks.map(track => ({ uri: track.uri })),
  };

  if (tracks.length > 0) {
    await api
      .delete<SpotifyApi.RemoveTracksFromPlaylistResponse>(`/playlists/${playlistId}/tracks`, {
        data: requestData,
      })
      .catch((err: AxiosError) => {
        console.error(err.toJSON());
      });

    console.log('Successfully removed the following songs:');

    tracks.forEach(track => {
      console.log(`- ${track.artists.map(artist => artist.name).join(' + ')} - ${track.name}`);
    });
  }
};
