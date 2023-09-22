import { useRouter } from 'next/router';
import React from 'react';

import { Link } from '@chakra-ui/next-js';
import { Box, Icon } from '@chakra-ui/react';
import { RxArrowLeft } from 'react-icons/rx';

import { useAppTranslation } from '@src/hooks';

export const BackButton: React.FC = () => {
  const { t } = useAppTranslation();
  const router = useRouter();

  return router.pathname === '/' ? (
    <Box />
  ) : (
    <Link href="/">
      <Icon as={RxArrowLeft} boxSize="4" />
      {t('common:back')}
    </Link>
  );
};
