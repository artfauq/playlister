import { UserProfile } from '@src/types';

export const userProfileDto = (user: SpotifyApi.UserObjectPublic): UserProfile => {
  return {
    id: user.id,
    name: user.display_name ?? null,
    profileImageUrl: user.images?.[0].url ?? null,
    uri: user.uri,
  };
};
