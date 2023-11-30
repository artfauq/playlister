import React from 'react';

import { Link } from '@chakra-ui/next-js';
import { Box, BoxProps, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Trans from 'next-translate/Trans';

import { Logo } from '@src/components/Logo';

export type FooterProps = BoxProps;

export const Footer: React.FC<FooterProps> = ({ ...rest }) => {
  return (
    <Box as="footer" bg={useColorModeValue('gray.50', 'gray.700')} p="4" {...rest}>
      <Flex
        align="center"
        my="2"
        _before={{
          content: '""',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          flexGrow: 1,
          mr: 8,
        }}
        _after={{
          content: '""',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          flexGrow: 1,
          ml: 8,
        }}
      >
        <Logo size="sm" />
      </Flex>
      <Trans
        i18nKey="common:footer.madeBy"
        components={[
          <Text colorScheme="gray" fontSize="xs" textAlign="center" />,
          <Link href="https://github.com/artfauq" color="teal.500" />,
        ]}
      />
    </Box>
  );
};
