const scopes = [
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private',
  'user-library-read',
  'user-top-read',
] as const;

export const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  scope: scopes.join(' '),
} as const;
