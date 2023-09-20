import React, { useEffect } from 'react';

import { useToast } from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';

export const GlobalLoadingIndicator: React.FC = () => {
  const isFetching = useIsFetching();
  const toast = useToast();

  useEffect(() => {
    if (isFetching && !toast.isActive('global-loading-indicator')) {
      toast({
        id: 'global-loading-indicator',
        isClosable: false,
        position: 'top-right',
        status: 'info',
        title: 'Queries are fetching in the background...',
        variant: 'subtle',
      });
    }
  }, [isFetching, toast]);

  return null;
};
