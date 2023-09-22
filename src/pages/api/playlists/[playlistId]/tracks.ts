import { spotifyApi } from '@src/lib';
import { Track } from '@src/types';
import { authenticatedHandler } from '@src/utils';

type ResponseData = Track[];

export default authenticatedHandler<ResponseData>(async (req, res) => {
  const tracks = await spotifyApi.fetchPlaylistTracks(req.query.playlistId as string, {
    Authorization: `Bearer ${req.session.accessToken}`,
  });

  res.status(200).json(tracks);
});
