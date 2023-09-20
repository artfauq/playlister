import React from 'react';

import { Container, VStack } from '@chakra-ui/react';

import { Footer } from '../Footer';
import { Header } from '../Header';

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>

      <Container as="main" maxW={['none', '8xl']} h="100%" py="4">
        <VStack align="stretch" minH="100%" spacing="4">
          <Header />
          <VStack align="stretch" flex={1} spacing={8}>
            {children}
          </VStack>
          <Footer />
        </VStack>
      </Container>
    </>
  );
};
