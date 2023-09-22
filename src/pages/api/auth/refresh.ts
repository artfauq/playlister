import { stringify } from 'querystring';

import axios from 'axios';

import { spotifyConfig } from '@src/config';
import { TokenResponse } from '@src/types';
import { authenticatedHandler } from '@src/utils';

type ResponseData = TokenResponse;

const { clientId, clientSecret } = spotifyConfig;

export default authenticatedHandler<ResponseData>(async (req, res) => {
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = stringify({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: req.session.refreshToken,
  });

  const { data } = await axios.post<TokenResponse>('https://accounts.spotify.com/api/token', body, {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  res.status(200).json(data);
});
