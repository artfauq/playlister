import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const Document: React.FC = () => {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
