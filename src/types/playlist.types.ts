import { UserProfile } from './user.types';

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  coverImage?: string;
  collaborative: boolean;
  followers?: number;
  public: boolean | null;
  owner: UserProfile;
  snapshotId: string;
  stale: boolean;
  trackCount: number;
};

export type CreatePlaylistInput = {
  name: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
};
