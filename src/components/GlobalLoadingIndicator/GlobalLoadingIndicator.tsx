import React from 'react';

import { HStack, Spinner } from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';

export const GlobalLoadingIndicator: React.FC = () => {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <HStack align="center" pos="absolute" bottom="12px" right="16px">
      <Spinner color="blackAlpha.500" size="sm" />
    </HStack>
  );
};
