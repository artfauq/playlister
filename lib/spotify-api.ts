import { stringify } from 'querystring';

import axios, { RawAxiosRequestHeaders } from 'axios';

import { BASIC_AUTH, CLIENT_ID, TOKEN_ENDPOINT } from '@src/config';
import { apiRequest } from '@src/lib/api-client';
import { CreatePlaylistInput, Playlist, TokenResponse, Track } from '@src/types';
import { sortPlaylistsByName, sortTracksByName, splitArrayIntoChunks } from '@src/utils';

/**
 * Get an access token for the Spotify API.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const data = stringify({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await axios.post<TokenResponse>(TOKEN_ENDPOINT, data, {
    headers: {
      'Authorization': `Basic ${BASIC_AUTH}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Get profile information about the current user.
 */
export const fetchUserProfile = async () => {
  return apiRequest<SpotifyApi.UserProfileResponse>({ url: '/me' });
};

/**
 * Get the current user's playlists.
 */
export const fetchUserPlaylists = async (headers?: RawAxiosRequestHeaders): Promise<Playlist[]> => {
  const data = await apiRequest<SpotifyApi.ListOfUsersPlaylistsResponse>({
    url: '/me/playlists',
    headers,
    params: {
      limit: 50,
    },
  });

  const playlists = [...data.items];

  while (data.next) {
    const nextData = await apiRequest<SpotifyApi.ListOfUsersPlaylistsResponse>({
      url: data.next,
      headers,
    });

    playlists.push(...nextData.items);

    data.next = nextData.next;
  }

  return sortPlaylistsByName(playlists);
};

/**
 * Get the current user's saved tracks.
 */
export const fetchSavedTracks = async (): Promise<Track[]> => {
  const data = await apiRequest<SpotifyApi.UsersSavedTracksResponse>({
    url: '/me/tracks',
    params: {
      limit: 50,
    },
  });

  const res = [...data.items];

  while (data.next) {
    const nextData = await apiRequest<SpotifyApi.UsersSavedTracksResponse>({ url: data.next });

    res.push(...nextData.items);

    data.next = nextData.next;
  }

  const tracks: Track[] = res.filter(track => track.track != null).map(track => track.track);

  return sortTracksByName(tracks);
};

/**
 * Get the tracks of a playlist owned by the current user.
 */
export const fetchPlaylistTracks = async (
  playlistId: string,
  headers?: RawAxiosRequestHeaders,
): Promise<Track[]> => {
  const data = await apiRequest<SpotifyApi.PlaylistTrackResponse>({
    url: `/playlists/${playlistId}/tracks`,
    headers,
    params: {
      limit: 100,
    },
  });

  const res = [...data.items];

  while (data.next) {
    const nextData = await apiRequest<SpotifyApi.PlaylistTrackResponse>({
      url: data.next,
      headers,
    });

    res.push(...nextData.items);

    data.next = nextData.next;
  }

  const tracks = res.filter(track => track.track != null).map(track => track.track) as Track[];

  return sortTracksByName(tracks);
};

/**
 * Get playlist details.
 */
export const fetchPlaylist = async (playlistId: string, headers?: RawAxiosRequestHeaders) => {
  return apiRequest<SpotifyApi.SinglePlaylistResponse>({
    url: `/playlists/${playlistId}`,
    headers,
  });
};

/**
 * Create a playlist.
 */
export const createPlaylist = async (values: CreatePlaylistInput) => {
  const { id: userId } = await fetchUserProfile();

  return apiRequest<SpotifyApi.CreatePlaylistResponse>({
    method: 'POST',
    url: `/users/${userId}/playlists`,
    data: JSON.stringify(values),
  });
};

/**
 * Add tracks to a playlist.
 */
export const addTracksToPlaylist = async (playlistId: string, tracks: Track[]) => {
  if (!tracks.length) return;

  await Promise.all(
    splitArrayIntoChunks(tracks, 100).map(tracksChunk => {
      return apiRequest<SpotifyApi.PlaylistSnapshotResponse>({
        method: 'POST',
        url: `/playlists/${playlistId}/tracks`,
        data: JSON.stringify({
          uris: tracksChunk.map(track => track.linked_from?.uri ?? track.uri),
        }),
      });
    }),
  );
};

/**
 * Remove tracks from a playlist.
 */
export const removeTracksFromPlaylist = async (playlistId: string, tracks: Track[]) => {
  if (!tracks.length) return;

  await Promise.all(
    splitArrayIntoChunks(tracks, 100).map(tracksChunk => {
      return apiRequest<SpotifyApi.PlaylistSnapshotResponse>({
        method: 'DELETE',
        url: `/playlists/${playlistId}/tracks`,
        data: JSON.stringify({
          tracks: tracksChunk.map(track => ({
            uri: track.linked_from?.uri ?? track.uri,
          })),
        }),
      });
    }),
  );
};

/**
 * Get audio features for multiple tracks based on their Spotify IDs.
 */
export const fetchTracksAudioFeatures = async (
  trackIds: string[],
  headers?: RawAxiosRequestHeaders,
) => {
  const audioFeatures = await Promise.all(
    splitArrayIntoChunks(trackIds, 100).map(trackIdsChunk => {
      return apiRequest<SpotifyApi.MultipleAudioFeaturesResponse>({
        url: '/audio-features',
        headers,
        params: {
          ids: trackIdsChunk.join(','),
        },
      });
    }),
  );

  return audioFeatures.reduce<SpotifyApi.AudioFeaturesObject[]>(
    (acc, { audio_features }) => [...acc, ...audio_features],
    [],
  );
};
