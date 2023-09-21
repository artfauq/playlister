import { stringify } from 'querystring';

import axios, { RawAxiosRequestHeaders } from 'axios';

import { spotifyConfig } from '@src/config';
import { apiRequest } from '@src/lib/api-client';
import { CreatePlaylistInput, Playlist, TokenResponse, Track, UserProfile } from '@src/types';
import {
  playlistDto,
  sortPlaylistsByName,
  splitArrayIntoChunks,
  trackDto,
  userProfileDto,
} from '@src/utils';

/**
 * Get an access token for the Spotify API.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const { clientId, clientSecret } = spotifyConfig;
  const data = stringify({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post<TokenResponse>('https://accounts.spotify.com/api/token', data, {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Get profile information about the current user.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const user = await apiRequest<SpotifyApi.UserProfileResponse>({ url: '/me' });

  return userProfileDto(user);
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

  return sortPlaylistsByName(playlists.map(playlistDto));
};

/**
 * Get the current user's saved tracks.
 */
export const fetchSavedTracks = async (headers?: RawAxiosRequestHeaders): Promise<Track[]> => {
  const data = await apiRequest<SpotifyApi.UsersSavedTracksResponse>({
    url: '/me/tracks',
    headers,
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

  const tracks = res.map(track => trackDto(track.track, track.added_at));

  return [...tracks].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get the number of tracks saved by the current user.
 */
export const countSavedTracks = async (headers?: RawAxiosRequestHeaders): Promise<number> => {
  const data = await apiRequest<SpotifyApi.UsersSavedTracksResponse>({
    url: '/me/tracks',
    headers,
    params: {
      limit: 1,
    },
  });

  return data.total;
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

  return res
    .reduce<Track[]>(
      (acc, track) => (track.track ? [...acc, trackDto(track.track, track.added_at)] : acc),
      [],
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get playlist details.
 */
export const fetchPlaylist = async (
  playlistId: string,
  headers?: RawAxiosRequestHeaders,
): Promise<Playlist> => {
  return apiRequest<SpotifyApi.SinglePlaylistResponse>({
    url: `/playlists/${playlistId}`,
    headers,
  }).then(playlistDto);
};

/**
 * Create a playlist.
 */
export const createPlaylist = async (values: CreatePlaylistInput): Promise<Playlist> => {
  const { id: userId } = await fetchUserProfile();

  return apiRequest<SpotifyApi.CreatePlaylistResponse>({
    method: 'POST',
    url: `/users/${userId}/playlists`,
    data: JSON.stringify(values),
  }).then(playlistDto);
};

/**
 * Add tracks to a playlist.
 */
export const addTracksToPlaylist = async (playlistId: string, tracks: Track[]): Promise<void> => {
  if (!tracks.length) return;

  await Promise.all(
    splitArrayIntoChunks(tracks, 100).map(tracksChunk => {
      return apiRequest<SpotifyApi.PlaylistSnapshotResponse>({
        method: 'POST',
        url: `/playlists/${playlistId}/tracks`,
        data: JSON.stringify({
          uris: tracksChunk.map(track => track.linkedFrom?.uri ?? track.uri),
        }),
      });
    }),
  );
};

/**
 * Remove tracks from a playlist.
 */
export const removeTracksFromPlaylist = async (
  playlistId: string,
  tracks: Track[],
): Promise<void> => {
  if (!tracks.length) return;

  await Promise.all(
    splitArrayIntoChunks(tracks, 100).map(tracksChunk => {
      return apiRequest<SpotifyApi.PlaylistSnapshotResponse>({
        method: 'DELETE',
        url: `/playlists/${playlistId}/tracks`,
        data: JSON.stringify({
          tracks: tracksChunk.map(track => ({
            uri: track.linkedFrom?.uri ?? track.uri,
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
