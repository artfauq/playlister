export const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
export const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

export const API_URL = 'https://api.spotify.com/v1';
export const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
export const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize';

export const BASIC_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

export const scope =
  'playlist-modify-private playlist-read-private playlist-modify-public user-library-read';
