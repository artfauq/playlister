import { useRouter } from 'next/router';
import React from 'react';

import { Box } from '@chakra-ui/react';

import { useAppTranslation } from '@src/hooks';

type Props = {
  children: React.ReactNode;
};

export const TemplateName: React.FC<Props> = ({ children }) => {
  const { t } = useAppTranslation();
  const router = useRouter();

  return <Box>{children}</Box>;
};
