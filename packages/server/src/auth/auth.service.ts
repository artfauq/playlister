import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config';
import { EnvironmentConfig } from 'config/environment.config';
import { SpotifyConfig } from 'config/spotify.config';
import { stringify } from 'querystring';
import { firstValueFrom } from 'rxjs';
import { Token } from './types/auth';

@Injectable()
export class AuthService {
  private redirectUri: string;

  constructor(
    private configService: ConfigService<Config, true>,
    private httpService: HttpService,
  ) {
    const { publicHost } = this.configService.get<EnvironmentConfig>('environment');

    this.redirectUri = `${publicHost}/auth/callback`;
  }

  getAuthorizeUrl() {
    const { accountsUrl, clientId, scope } = this.configService.get<SpotifyConfig>('spotify');

    const query = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      // state,
      scope,
    };

    return `${String(accountsUrl)}/authorize?${stringify(query)}`;
  }

  async getAccessToken(code: string) {
    const body = {
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<Token>('/api/token', stringify(body)),
    );

    return data;
  }

  async refreshToken(refreshToken: string) {
    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<Token>('/api/token', stringify(body)),
    );

    return data;
  }
}
