import type { QueryClientConfig } from '@tanstack/react-query';
import ms from 'ms';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      cacheTime: ms('1w'),
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      staleTime: ms('1m'),
    },
  },
};
