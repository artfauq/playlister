import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { refreshAccessToken } from '@src/lib/spotify-api';
import { authOptions } from '@src/pages/api/auth/[...nextauth]';
import { TokenResponse } from '@src/types';

type ResponseData = TokenResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401);
    return;
  }

  const accessToken = await refreshAccessToken(session.refreshToken);

  res.status(200).json(accessToken);
}
