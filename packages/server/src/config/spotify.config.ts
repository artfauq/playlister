import { ConfigType, registerAs } from '@nestjs/config';

export type SpotifyConfig = ConfigType<typeof spotifyConfig>;

const spotifyConfig = registerAs('spotify', () => ({
  apiUrl: 'https://api.spotify.com/v1',
  accountsUrl: 'https://accounts.spotify.com',
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  scope: 'playlist-modify-private playlist-read-private playlist-modify-public user-library-read',
}));

export default spotifyConfig;
