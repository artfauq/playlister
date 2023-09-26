import { Playlist } from '@src/types';
import { userProfileDto } from '@src/utils/user.utils';

export const playlistDto = (
  playlist: SpotifyApi.PlaylistObjectSimplified | SpotifyApi.PlaylistObjectFull,
  previousSnapshotId?: string,
): Readonly<Playlist> => {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    coverImage: playlist.images.length ? playlist.images[0].url : undefined,
    collaborative: playlist.collaborative,
    followers: 'followers' in playlist ? playlist.followers.total : undefined,
    stale: playlist.snapshot_id === previousSnapshotId,
    public: playlist.public,
    owner: userProfileDto(playlist.owner),
    snapshotId: playlist.snapshot_id,
    trackCount: playlist.tracks.total,
  };
};
