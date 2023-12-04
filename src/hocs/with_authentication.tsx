import { useRouter } from 'next/router';
import React, { ComponentType, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { CurrentUserProvider } from '@src/modules/user';

export const withAuthentication = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const RequiresAuthentication: React.FC<P> = props => {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/');
      }
    }, [status, router]);

    if (status === 'loading') return null;

    return status === 'authenticated' ? (
      <CurrentUserProvider>
        <WrappedComponent {...props} />
      </CurrentUserProvider>
    ) : null;
  };

  return RequiresAuthentication;
};
