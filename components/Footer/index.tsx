import React from 'react';

import { Box, Center, HStack, Image, Text } from '@chakra-ui/react';

import { useAppTranslation } from '@src/hooks';

type Props = {};

export const Footer: React.FC<Props> = () => {
  const { t } = useAppTranslation();

  return (
    <Box as="footer" mt="8" mb="4">
      <Center>
        <HStack align="center">
          <Image src="/logo.png" alt="Spotify Logo" placeholder="blur" w="30px" h="30px" />
          <Text fontSize="md" fontWeight="semibold">
            {t('common:playlister')}
          </Text>
        </HStack>
      </Center>
    </Box>
  );
};
