import { Playlist } from '@src/types';

export const playlistDto = (
  playlist: SpotifyApi.PlaylistObjectSimplified | SpotifyApi.PlaylistObjectFull,
  previousSnapshotId?: string,
): Readonly<Playlist> => {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    coverImage: playlist.images.length ? playlist.images[0].url : null,
    collaborative: playlist.collaborative,
    followers: 'followers' in playlist ? playlist.followers.total : null,
    stale: playlist.snapshot_id === previousSnapshotId,
    public: playlist.public,
    owner: playlist.owner
      ? {
          id: playlist.owner.id,
          name: playlist.owner.display_name ?? null,
          image: playlist.owner.images?.length ? playlist.owner.images[0].url : null,
        }
      : null,
    snapshotId: playlist.snapshot_id,
    trackCount: playlist.tracks.total,
  };
};
