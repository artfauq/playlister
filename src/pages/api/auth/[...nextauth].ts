import NextAuth from 'next-auth';

import { nextAuthConfig } from '@src/config';

export default NextAuth(nextAuthConfig);
