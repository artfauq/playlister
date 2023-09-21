import NextAuth, { Account, AuthOptions, CallbacksOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

import { spotifyConfig } from '@src/config';
import { refreshAccessToken } from '@src/lib/spotify-api';

const isValidAccount = (account: Account | {} | null): account is Account => {
  return !!account && 'access_token' in account;
};

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyConfig.scope}`,
      clientId: spotifyConfig.clientId,
      clientSecret: spotifyConfig.clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ account = {}, profile, token }) {
      if (isValidAccount(account)) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at;
        token.refreshToken = account.refresh_token;
      }

      if (profile?.id) {
        token.id = profile.id;
      }

      if (Date.now() >= token.accessTokenExpires) {
        return refreshAccessToken(token.refreshToken).then(({ access_token, expires_in }) => {
          token.accessToken = access_token;
          token.accessTokenExpires = Date.now() + expires_in * 1000;

          return token;
        });
      }

      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = {
        id: token.id,
        name: session.user.name,
        image: session.user.image,
      };

      return session;
    },
  } as Partial<CallbacksOptions>,
};

export default NextAuth(authOptions);
