import { UserProfile } from './user.types';

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string;
  collaborative: boolean;
  public: boolean | null;
  owner: UserProfile;
  trackCount: number;
};

export type CreatePlaylistInput = {
  name: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
};
