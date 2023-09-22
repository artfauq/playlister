import type { AppProps, NextWebVitalsMetric } from 'next/app';
import React, { useState } from 'react';

import { ChakraBaseProvider } from '@chakra-ui/react';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Inter } from 'next/font/google';

import { GlobalLoadingIndicator } from '@src/components';
import { defaultSEOConfig } from '@src/config';
import { queryClient } from '@src/lib';
import theme from '@src/theme';
import { handleMetric } from '@src/utils';

const inter = Inter({ subsets: ['latin'] });

const App: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [client] = useState(() => queryClient);

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }

          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}
      </style>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <Hydrate state={pageProps.dehydratedState}>
            <ChakraBaseProvider theme={theme} resetCSS>
              <DefaultSeo {...defaultSEOConfig} />
              <Component {...pageProps} />
              <GlobalLoadingIndicator />
              <ReactQueryDevtools />
            </ChakraBaseProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};

export const reportWebVitals = (metric: NextWebVitalsMetric) => handleMetric(metric);

export default App;
