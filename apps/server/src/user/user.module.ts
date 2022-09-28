import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from 'config';
import { SpotifyConfig } from 'config/spotify.config';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config, true>) => ({
        baseURL: configService.get<SpotifyConfig>('spotify').apiUrl,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
})
export class UserModule {}
