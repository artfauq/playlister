import { spotifyApi } from '@src/lib';
import { TokenResponse } from '@src/types';
import { authenticatedHandler } from '@src/utils';

type ResponseData = TokenResponse;

export default authenticatedHandler<ResponseData>(async (req, res) => {
  const token = await spotifyApi.refreshAccessToken(req.session.refreshToken);

  res.status(200).json(token);
});
