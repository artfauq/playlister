import { AuthenticatedNextApiHandler, AuthenticatedNextApiRequest, NextApiHandler } from 'next';

import { getServerSession } from 'next-auth';

import { nextAuthConfig } from '@src/config';

export const authenticatedHandler: <TData = any>(
  handler: AuthenticatedNextApiHandler<TData>,
) => NextApiHandler = handler => async (req, res) => {
  const session = await getServerSession(req, res, nextAuthConfig);

  if (!session) {
    res.status(401);
    return;
  }

  req.session = session;

  await handler(req as AuthenticatedNextApiRequest, res);
};
