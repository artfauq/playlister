import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Config } from 'config';
import { EnvironmentConfig } from 'config/environment.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<Config, true> = app.get(ConfigService);
  const { port } = configService.get<EnvironmentConfig>('environment');

  await app.listen(port);
}

void bootstrap();
