export const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  scope: 'playlist-modify-private playlist-read-private playlist-modify-public user-library-read',
};
