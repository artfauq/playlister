import React from 'react';

import { Container, VStack } from '@chakra-ui/react';

import { Footer } from '../Footer';
import { Header } from '../Header';

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Container as="main" h="100%" maxW={['none', '6xl']} py="4">
      <VStack align="stretch" minH="100%" spacing="4">
        <Header />
        <VStack align="stretch" flex={1} spacing={8}>
          {children}
        </VStack>
        <Footer />
      </VStack>
    </Container>
  );
};
