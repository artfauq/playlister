import { ConfigType, registerAs } from '@nestjs/config';

export type EnvironmentConfig = ConfigType<typeof environmentConfig>;

const environmentConfig = registerAs('environment', () => ({
  env: process.env.NODE_ENV,
  port: +process.env.PORT!,
  publicHost: process.env.PUBLIC_HOST,
}));

export default environmentConfig;
