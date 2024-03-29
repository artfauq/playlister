import type { AppProps, NextWebVitalsMetric } from 'next/app';
import React, { useRef } from 'react';

import { ChakraBaseProvider } from '@chakra-ui/react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  PersistQueryClientProvider,
  PersistQueryClientProviderProps,
} from '@tanstack/react-query-persist-client';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Inter } from 'next/font/google';

import { GlobalLoadingIndicator } from '@src/components';
import { defaultSEOConfig, queryClientConfig } from '@src/config';
import theme from '@src/theme';
import { handleMetric } from '@src/utils';

const inter = Inter({ subsets: ['latin'] });

const App: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const queryClient = useRef(new QueryClient(queryClientConfig));

  const QueryClientProviderWithPersist =
    typeof window !== 'undefined' ? PersistQueryClientProvider : QueryClientProvider;
  const queryClientProviderProps =
    typeof window !== 'undefined'
      ? ({
          client: queryClient.current,
          persistOptions: {
            persister: createSyncStoragePersister({ storage: window.localStorage }),
          },
        } as PersistQueryClientProviderProps)
      : ({
          client: queryClient.current,
        } as QueryClientProviderProps);

  const globalStyle = `
    :root {
      --font-inter: ${inter.style.fontFamily};
    }

    #__next {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `;

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>
        {globalStyle}
      </style>

      <SessionProvider session={session}>
        <QueryClientProviderWithPersist {...(queryClientProviderProps as any)}>
          <Hydrate state={pageProps.dehydratedState}>
            <ChakraBaseProvider theme={theme} resetCSS>
              <DefaultSeo {...defaultSEOConfig} />
              <Component {...pageProps} />
              <GlobalLoadingIndicator />
              <ReactQueryDevtools />
            </ChakraBaseProvider>
          </Hydrate>
        </QueryClientProviderWithPersist>
      </SessionProvider>
    </>
  );
};

export const reportWebVitals = (metric: NextWebVitalsMetric) => handleMetric(metric);

export default App;
