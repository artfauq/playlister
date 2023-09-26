import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import { ColorModeScript } from '@chakra-ui/react';

import theme from '@src/theme';

const Document: React.FC = () => {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
