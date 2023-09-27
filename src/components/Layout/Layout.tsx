import React from 'react';

import { Container, Flex, useColorModeValue } from '@chakra-ui/react';

import { Footer, FooterProps } from '../Footer';
import { Header } from '../Header';

type Props = FooterProps & {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children, showLogo }) => {
  const backgroundColor = useColorModeValue(
    'linear(to-b, gray.50, gray.100)',
    'linear(to-b, gray.900, gray.700)',
  );

  return (
    <Flex direction="column" bgGradient={backgroundColor} minH="100%">
      <Header />
      <Container
        as="main"
        display="flex"
        flex={1}
        flexDirection="column"
        maxW={['none', '8xl']}
        pb="10"
      >
        {children}
      </Container>
      <Footer showLogo={showLogo} />
    </Flex>
  );
};
