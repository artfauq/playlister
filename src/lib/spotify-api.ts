import { stringify } from 'querystring';

import axios, { AxiosRequestConfig, isAxiosError, RawAxiosRequestHeaders } from 'axios';
import { getSession } from 'next-auth/react';

import { spotifyConfig } from '@src/config';
import { CreatePlaylistInput, TokenResponse, Track } from '@src/types';
import { splitArrayIntoChunks } from '@src/utils';

export const spotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

spotifyClient.interceptors.request.use(async config => {
  const authHeader = config.headers.get('Authorization');

  if (!authHeader) {
    const session = await getSession();
    const accessToken = session?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      spotifyClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

spotifyClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (!isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const {
        data: { access_token: accessToken },
      } = await axios.post<TokenResponse>('/api/auth/refresh');

      spotifyClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      return spotifyClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

/**
 * Make a request to the Spotify API.
 */
export const apiRequest = async <TData>(
  config: AxiosRequestConfig = {
    method: 'GET',
  },
) => {
  return spotifyClient<TData>(config).then(response => response.data);
};

// Taken from @types/spotify-api
type PagingObject<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export const fetchPaginatedData = async <T>(config?: AxiosRequestConfig): Promise<T[]> => {
  const data = await apiRequest<PagingObject<T>>(config);

  const res = [...data.items];

  while (data.next) {
    const nextData = await apiRequest<PagingObject<T>>({ ...config, url: data.next });

    res.push(...nextData.items);

    data.next = nextData.next;
  }

  return res;
};

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
export const fetchUserProfile = async () => {
  return apiRequest<SpotifyApi.UserProfileResponse>({ url: '/me' });
};

/**
 * Get the current user's playlists.
 */
export const fetchUserPlaylists = async () => {
  return fetchPaginatedData<SpotifyApi.PlaylistObjectSimplified>({
    url: '/me/playlists',
    params: {
      limit: 50,
    },
  });
};

/**
 * Get the current user's saved tracks.
 */
export function fetchSavedTracks(): Promise<SpotifyApi.SavedTrackObject[]>;

export function fetchSavedTracks(params: {
  limit: number;
  offset: number;
}): Promise<SpotifyApi.UsersSavedTracksResponse>;

export async function fetchSavedTracks(params?: { limit: number; offset: number }) {
  if (params) {
    return apiRequest<SpotifyApi.UsersSavedTracksResponse>({
      url: '/me/tracks',
      params,
    });
  }

  return fetchPaginatedData<SpotifyApi.SavedTrackObject>({
    url: '/me/tracks',
    params: {
      limit: 50,
    },
  });
}

/**
 * Get the number of tracks saved by the current user.
 */
export const countSavedTracks = async (): Promise<number> => {
  const data = await apiRequest<SpotifyApi.UsersSavedTracksResponse>({
    url: '/me/tracks',
    params: {
      limit: 1,
    },
  });

  return data.total;
};

/**
 * Get the tracks of a playlist owned by the current user.
 */
export function fetchPlaylistTracks(playlistId: string): Promise<SpotifyApi.PlaylistTrackObject[]>;

export function fetchPlaylistTracks(
  playlistId: string,
  params: { limit: number; offset: number },
): Promise<SpotifyApi.PlaylistTrackResponse>;

export async function fetchPlaylistTracks(
  playlistId: string,
  params?: { limit: number; offset: number },
) {
  if (params) {
    return apiRequest<SpotifyApi.PlaylistTrackResponse>({
      url: `/playlists/${playlistId}/tracks`,
      params,
    });
  }

  return fetchPaginatedData<SpotifyApi.PlaylistTrackObject>({
    url: `/playlists/${playlistId}/tracks`,
    params: {
      limit: 100,
    },
  });
}

/**
 * Get playlist details.
 */
export const fetchPlaylist = async (playlistId: string) => {
  return apiRequest<SpotifyApi.SinglePlaylistResponse>({ url: `/playlists/${playlistId}` });
};

/**
 * Create a playlist.
 */
export const createPlaylist = async (userId: string, values: CreatePlaylistInput) => {
  return apiRequest<SpotifyApi.CreatePlaylistResponse>({
    method: 'POST',
    url: `/users/${userId}/playlists`,
    data: JSON.stringify(values),
  });
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
  return Promise.all(
    splitArrayIntoChunks(trackIds, 100).map(trackIdsChunk => {
      return apiRequest<SpotifyApi.MultipleAudioFeaturesResponse>({
        url: '/audio-features',
        headers,
        params: {
          ids: trackIdsChunk.join(','),
        },
      });
    }),
  ).then(res =>
    res.reduce<SpotifyApi.AudioFeaturesObject[]>(
      (acc, { audio_features }) => [...acc, ...audio_features],
      [],
    ),
  );
};

export const checkUserSavedTracks = async (trackIds: string[]) => {
  return Promise.all(
    splitArrayIntoChunks(trackIds, 50).map(trackIdsChunk => {
      return apiRequest<boolean[]>({
        url: '/me/tracks/contains',
        params: {
          ids: trackIdsChunk.join(','),
        },
      });
    }),
  ).then(res => res.reduce((acc, curr) => [...acc, ...curr], []));
};
