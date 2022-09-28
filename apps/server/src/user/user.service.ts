import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private httpService: HttpService) {}

  async getUserProfile(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data: userProfile } = await firstValueFrom(
      this.httpService.get<SpotifyApi.UserProfileResponse>('/me', {
        headers,
      }),
    );

    return userProfile;
  }
}
