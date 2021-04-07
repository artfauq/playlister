import dotenv from 'dotenv';
import convict from 'convict';

/**
 * Load environment variables
 */
dotenv.config();

const config = convict({
  spotifyApi: {
    baseUrl: {
      format: String,
      doc: 'Spotify API base url',
      default: 'https://api.spotify.com/v1',
    },
    token: {
      doc: 'Spotify access token',
      format: String,
      env: 'TOKEN',
      default: '',
    },
  },
});

/**
 * Validate config schema
 */
config.validate({ allowed: 'strict' });

export default config.getProperties();
