export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  collaborative: boolean;
  followers: number | null;
  public: boolean | null;
  owner: string | null;
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
