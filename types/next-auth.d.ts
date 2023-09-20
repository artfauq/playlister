// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Account {
    access_token: string;
    token_type: string;
    expires_at: number;
    refresh_token: string;
  }

  interface Profile extends SpotifyApi.UserObjectPublic {}

  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      image?: string;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}
