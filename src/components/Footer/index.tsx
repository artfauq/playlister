import React from 'react';

import { Link } from '@chakra-ui/next-js';
import { Box, Center, Divider, Text, VStack } from '@chakra-ui/react';

import { Logo } from '@src/components/Logo';

export type FooterProps = {
  showLogo?: boolean;
};

export const Footer: React.FC<FooterProps> = ({ showLogo = true }) => {
  return (
    <Box as="footer" bg="gray.50">
      <Divider />
      <Center p="4">
        <VStack spacing="0">
          {showLogo && <Logo size="sm" mb="1" />}
          <Text as="span" color="gray.600" fontSize="xs">
            Made with ♥️ by{' '}
            <Link href="https://github.com/artfauq" color="teal.500">
              artfauq
            </Link>
          </Text>
        </VStack>
      </Center>
    </Box>
  );
};
