import { NextApiResponse } from 'next';

import { Session } from 'next-auth';

declare module 'next' {
  interface NextApiRequest {
    session: Session | null;
  }

  interface AuthenticatedNextApiRequest extends NextApiRequest {
    session: Session;
  }

  type AuthenticatedNextApiHandler<TData = any> = (
    req: AuthenticatedNextApiRequest,
    res: NextApiResponse<TData>,
  ) => unknown | Promise<unknown>;
}
