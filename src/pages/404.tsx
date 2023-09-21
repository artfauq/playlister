import React from 'react';

import { Link } from '@chakra-ui/next-js';
import { Center, Container, Heading, Text } from '@chakra-ui/react';

import { useAppTranslation } from '@src/hooks';

const Custom404 = () => {
  const { t } = useAppTranslation();

  return (
    <Container as="main">
      <Center>
        <Heading as="h1">{t('common:pageNotFound')}</Heading>
        <Text>{t('common:notFoundSuggestion')}</Text>
        <Link href="/">{t('common:goHome')}</Link>
      </Center>
    </Container>
  );
};

export default Custom404;
