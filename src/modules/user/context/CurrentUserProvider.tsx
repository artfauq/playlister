import React, { PropsWithChildren, useContext } from 'react';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

const CurrentUserContext = React.createContext<Session['user'] | null>(null);

export const CurrentUserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession();

  if (data?.user == null) return null;

  return <CurrentUserContext.Provider value={data.user}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = () => {
  const user = useContext(CurrentUserContext);

  if (user == null) {
    throw new Error('useCurrentUser() must be used within a <CurrentUserProvider />');
  }

  return user;
};
