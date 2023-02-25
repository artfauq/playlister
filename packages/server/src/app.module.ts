import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentConfig, spotifyConfig, validationSchema } from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerService } from './logger/logger.service';
import { PlaylistModule } from './playlist/playlist.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig, spotifyConfig],
      validationSchema,
    }),
    AuthModule,
    PlaylistModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
