import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from 'config';
import { SpotifyConfig } from 'config/spotify.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config, true>) => {
        const { accountsUrl, clientId, clientSecret } = configService.get<SpotifyConfig>('spotify');

        return {
          baseURL: accountsUrl,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
              'base64',
            )}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
