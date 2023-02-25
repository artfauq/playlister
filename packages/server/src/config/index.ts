import * as Joi from 'joi';
import environmentConfig, { EnvironmentConfig } from './environment.config';
import spotifyConfig, { SpotifyConfig } from './spotify.config';

export type Config = {
  environment: EnvironmentConfig;
  spotify: SpotifyConfig;
};

export const validationSchema = Joi.object({
  // Environment config
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().positive().default(8080),
  PUBLIC_HOST: Joi.string().uri().required(),

  // Spotify config
  SPOTIFY_CLIENT_ID: Joi.string().required(),
  SPOTIFY_CLIENT_SECRET: Joi.string().required(),
});

export { environmentConfig, spotifyConfig };
