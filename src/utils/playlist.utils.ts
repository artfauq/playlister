import { Playlist } from '@src/types';
import { userProfileDto } from '@src/utils/user.utils';

export const playlistDto = (playlist: SpotifyApi.PlaylistObjectSimplified): Playlist => {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    coverImage: playlist.images[0].url,
    collaborative: playlist.collaborative,
    public: playlist.public,
    owner: userProfileDto(playlist.owner),
    trackCount: playlist.tracks.total,
  };
};
