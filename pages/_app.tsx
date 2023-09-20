import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import { ChakraBaseProvider } from '@chakra-ui/react';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Inter } from 'next/font/google';

import { GlobalLoadingIndicator } from '@src/components';
import queryClient from '@src/lib/query-client';
import theme from '@src/theme';

import SEO from '../next-seo.config';

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
        `}
      </style>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <Hydrate state={pageProps.dehydratedState}>
            <ChakraBaseProvider theme={theme} resetCSS>
              <DefaultSeo {...SEO} />
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

export default App;
