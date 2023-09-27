import React from 'react';

import { Link } from '@chakra-ui/next-js';
import { Box, Center, Divider, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { Logo } from '@src/components/Logo';

export type FooterProps = {
  showLogo?: boolean;
};

export const Footer: React.FC<FooterProps> = ({ showLogo = true }) => {
  const backgroundColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box as="footer" bg={backgroundColor}>
      <Divider />
      <Center p="4">
        <VStack spacing="0">
          {showLogo && <Logo size="sm" mb="1" />}
          <Text as="span" colorScheme="gray" fontSize="xs">
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
